# Design Document: Complete Task Manager

## Overview

This document describes the design for the four feature gaps in the Task Manager frontend: (1) status field in the task create/edit dialog, (2) status/priority filter controls on the dashboard, (3) UX improvements (delete confirmation, error banners, empty state), and (4) an analytics summary panel backed by the Python service. All changes are confined to the React/TypeScript frontend (`frontend/src/`) and the `api.ts` service layer. No backend changes are required.

The dominant language is **TypeScript** (React/MUI stack already in use).

---

## Architecture

The existing architecture has a single page component (`DashboardPage.tsx`) that owns all task state. The design extends this component with additional local state slices rather than introducing a new state management library.

```
DashboardPage
├── AppBar (existing)
├── AnalyticsPanel          ← new component
├── FilterBar               ← new component
├── Task Grid
│   ├── TaskCard (×N)       ← existing cards, unchanged
│   └── EmptyState          ← new component
├── TaskDialog              ← extended with status field
├── DeleteConfirmDialog     ← new component
└── ErrorBanner             ← new component
```

All network calls go through `api.ts`. A new `analyticsService` is added alongside the existing `taskService`.

---

## Components

### 1. TaskDialog (extended)

**File:** `frontend/src/pages/DashboardPage.tsx` (inline dialog, already exists)

**Changes:**
- Add `status` field to `formData` state, defaulting to `'todo'`.
- Populate `status` from `editingTask.status` when opening in edit mode.
- Add a MUI `<FormControl>` / `<Select>` for `Status` with options `todo`, `in-progress`, `completed`.
- Include `status` in both the `createTask` and `updateTask` call payloads.

**State addition:**
```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',   // NEW
  dueDate: '',
});
```

**`api.ts` change:** Update `createTask` signature to accept `status`:
```typescript
createTask: (title: string, description: string, priority: string, status: string, dueDate?: string) =>
  api.post('/tasks', { title, description, priority, status, dueDate }),
```

---

### 2. FilterBar

**File:** `frontend/src/pages/DashboardPage.tsx` (inline, or extracted to `frontend/src/components/FilterBar.tsx`)

**Props / state owned by DashboardPage:**
```typescript
const [statusFilter, setStatusFilter] = useState<string>('all');
const [priorityFilter, setPriorityFilter] = useState<string>('all');
```

**Derived list (computed in render, no extra fetch):**
```typescript
const filteredTasks = tasks.filter((t) => {
  const statusMatch = statusFilter === 'all' || t.status === statusFilter;
  const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
  return statusMatch && priorityMatch;
});
```

The task grid renders `filteredTasks` instead of `tasks`.

**UI:** Two side-by-side MUI `<Select>` controls labeled "Status" and "Priority", placed in the header row between the page title and the "New Task" button area.

---

### 3. DeleteConfirmDialog

**File:** `frontend/src/components/DeleteConfirmDialog.tsx`

```typescript
interface DeleteConfirmDialogProps {
  open: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

Renders a MUI `<Dialog>` with the task title in the body and two actions: **Cancel** and **Delete** (color `error`).

**DashboardPage state addition:**
```typescript
const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
```

Clicking "Delete" on a card sets `deleteTarget` (opens dialog). Confirming calls `handleDeleteTask(deleteTarget._id)` then sets `deleteTarget` to `null`.

---

### 4. ErrorBanner

**File:** `frontend/src/components/ErrorBanner.tsx`

```typescript
interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}
```

Renders a MUI `<Alert severity="error">` with a close button when `message` is non-null; renders nothing otherwise.

**DashboardPage state addition:**
```typescript
const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

Each catch block calls `setErrorMessage('...')` with a human-readable string instead of (or in addition to) `console.error`. Successful operations call `setErrorMessage(null)`.

---

### 5. EmptyState

**File:** `frontend/src/components/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  onCreateTask: () => void;
}
```

Renders a centered `<Box>` with a MUI `<Typography>` ("No tasks found") and a "Create your first task" `<Button>` that calls `onCreateTask`.

Displayed in `DashboardPage` when `filteredTasks.length === 0` and `!loading` and `!errorMessage`.

---

### 6. AnalyticsPanel

**File:** `frontend/src/components/AnalyticsPanel.tsx`

```typescript
interface AnalyticsData {
  total_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
  completion_percentage: number;
}

interface AnalyticsPanelProps {
  data: AnalyticsData | null;
  unavailable: boolean;
}
```

Renders a `<Paper>` strip above the task grid containing four MUI `<Chip>` or stat cards:
- **Total:** `data.total_tasks`
- **Done:** `data.completion_percentage`%
- Status breakdown (todo / in-progress / completed counts)
- Priority breakdown (low / medium / high counts)

When `unavailable` is `true`, renders an `<Alert severity="warning">` saying "Analytics unavailable."

**`api.ts` addition:**
```typescript
const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:8000';

const analyticsApi = axios.create({ baseURL: ANALYTICS_URL });
analyticsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const analyticsService = {
  getAnalytics: () => analyticsApi.get<AnalyticsData>('/analytics/tasks'),
};
```

**DashboardPage state:**
```typescript
const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
const [analyticsUnavailable, setAnalyticsUnavailable] = useState(false);

const fetchAnalytics = async () => {
  try {
    const res = await analyticsService.getAnalytics();
    setAnalytics(res.data);
    setAnalyticsUnavailable(false);
  } catch {
    setAnalyticsUnavailable(true);
  }
};
```

`fetchAnalytics` is called in the initial `useEffect` alongside `fetchTasks`, and again after every successful create, update, or delete.

---

## Data Flow

```
User action (create/edit/delete)
  → DashboardPage handler
    → taskService.createTask / updateTask / deleteTask
      → Express API (existing, unchanged)
    → on success: fetchTasks() + fetchAnalytics()
    → on failure: setErrorMessage(humanReadableString)

Dashboard mount
  → fetchTasks() → setTasks(response.data)
  → fetchAnalytics() → setAnalytics(response.data) | setAnalyticsUnavailable(true)

Filter change (statusFilter / priorityFilter)
  → filteredTasks recomputed synchronously (no network call)
  → React re-renders task grid
```

---

## Error Handling

| Operation | Failure behavior |
|---|---|
| `GET /tasks` | `setErrorMessage('Failed to load tasks.')` |
| `POST /tasks` | `setErrorMessage('Failed to create task.')` |
| `PUT /tasks/:id` | `setErrorMessage('Failed to update task.')` |
| `DELETE /tasks/:id` | `setErrorMessage('Failed to delete task.')` |
| `GET /analytics/tasks` | `setAnalyticsUnavailable(true)` (silent, task list unaffected) |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Status round-trip in edit dialog

For any task with any `status` value (`todo`, `in-progress`, `completed`), opening the Task Dialog in edit mode for that task and reading the `Status` selector's current value must equal the task's `status` field.

**Validates: Requirements 1.3**

---

### Property 2: Status included in submit payload

For any combination of task fields and any selected `status` value, submitting the Task Dialog must produce an API call payload that contains a `status` field equal to the selected value — for both create and update operations.

**Validates: Requirements 1.4, 1.5**

---

### Property 3: Filter correctness (conjunctive)

For any list of tasks, any `statusFilter` value (including `'all'`), and any `priorityFilter` value (including `'all'`), every task in `filteredTasks` must satisfy both filter predicates, and no task that satisfies both predicates must be absent from `filteredTasks`.

**Validates: Requirements 2.3, 2.4, 2.5, 2.6**

---

### Property 4: Delete confirmation shows task title

For any task, when the Delete Confirmation Dialog is opened for that task, the dialog's rendered content must contain the task's `title` string.

**Validates: Requirements 3.2**

---

### Property 5: Cancel delete is a no-op

For any task list state, opening the Delete Confirmation Dialog and then canceling must leave the task list state identical to its state before the dialog was opened, and must not trigger any network request to `DELETE /tasks/:id`.

**Validates: Requirements 3.4**

---

### Property 6: API failure produces Error Banner

For any task mutation operation (create, update, delete) where the corresponding API call rejects, the `errorMessage` state must be a non-null, non-empty string after the rejection is handled.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

---

### Property 7: Empty state visibility invariant

For any filter combination, the empty state component must be visible if and only if `filteredTasks.length === 0` AND no loading state is active AND `errorMessage` is null.

**Validates: Requirements 5.1, 5.3**

---

### Property 8: Analytics panel renders all required fields

For any `AnalyticsData` object returned by the Python service, the rendered Analytics Panel must contain display elements for `total_tasks`, `completion_percentage`, each key in `tasks_by_status`, and each key in `tasks_by_priority`.

**Validates: Requirements 6.2, 6.3**

---

### Property 9: Analytics re-fetch after task mutation

For any sequence of task mutations (create, update, or delete) that succeed, the analytics fetch function must be called once after each successful mutation, so that the displayed analytics remain consistent with the current task list.

**Validates: Requirements 6.6**
