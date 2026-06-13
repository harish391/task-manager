# Implementation Plan: Complete Task Manager

## Overview

Implement the four feature gaps in the Task Manager frontend: status field in the task dialog, dashboard filter controls, UX improvements (delete confirmation, error banners, empty state), and an analytics summary panel. All changes are in `frontend/src/`. No backend changes are needed.

## Tasks

- [x] 1. Add analytics service to `api.ts`
  - Create a second axios instance (`analyticsApi`) pointing to `REACT_APP_ANALYTICS_URL` (default `http://localhost:8000`) with the same JWT interceptor pattern used by the existing `api` instance
  - Export `analyticsService.getAnalytics()` that calls `GET /analytics/tasks`
  - Export the `AnalyticsData` TypeScript interface (`total_tasks`, `tasks_by_status`, `tasks_by_priority`, `completion_percentage`)
  - Update `createTask` in `taskService` to accept a `status` parameter and include it in the POST body
  - _Requirements: 1.5, 6.1_

- [x] 2. Add status field to the Task Dialog
  - Add `status: 'todo'` to the `formData` initial state in `DashboardPage`
  - When opening in edit mode (`handleOpenDialog(task)`), set `formData.status` from `task.status`
  - Add a MUI `<FormControl>` / `<Select>` labeled "Status" inside the Dialog with options `todo`, `in-progress`, `completed`
  - Pass `formData.status` in both the `createTask` call and the `updateTask` call payload
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.1 Write property test for status round-trip (Property 1)
    - **Property 1: Status round-trip in edit dialog**
    - For any task with any status value, opening edit mode pre-populates the selector with that status
    - **Validates: Requirements 1.3**

  - [ ]* 2.2 Write property test for status in submit payload (Property 2)
    - **Property 2: Status included in submit payload**
    - For any selected status, submitting the dialog includes that status in the API call body
    - **Validates: Requirements 1.4, 1.5**

- [x] 3. Create `DeleteConfirmDialog` component
  - Create `frontend/src/components/DeleteConfirmDialog.tsx`
  - Accept props: `open: boolean`, `taskTitle: string`, `onConfirm: () => void`, `onCancel: () => void`
  - Render a MUI `<Dialog>` whose body shows the task title and whose actions are **Cancel** and **Delete** (color `error`)
  - In `DashboardPage`, replace the inline `handleDeleteTask(task._id)` call on the Delete button with `setDeleteTarget(task)`
  - Add `deleteTarget: Task | null` state; render `<DeleteConfirmDialog>` with `open={!!deleteTarget}`; on confirm, call `handleDeleteTask(deleteTarget._id)` then `setDeleteTarget(null)`; on cancel, `setDeleteTarget(null)`
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 3.1 Write property test for confirmation dialog shows task title (Property 4)
    - **Property 4: Delete confirmation shows task title**
    - For any task, the dialog must contain the task's title in its rendered output
    - **Validates: Requirements 3.2**

  - [ ]* 3.2 Write property test for cancel is a no-op (Property 5)
    - **Property 5: Cancel delete is a no-op**
    - Canceling the dialog must leave task list state unchanged and make no DELETE API call
    - **Validates: Requirements 3.4**

- [x] 4. Create `ErrorBanner` component and wire up error handling
  - Create `frontend/src/components/ErrorBanner.tsx` — renders a dismissable MUI `<Alert severity="error">` when `message` is non-null; renders nothing otherwise
  - Add `errorMessage: string | null` state to `DashboardPage`; render `<ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />`
  - Replace every `console.error` catch block in `fetchTasks`, `handleSubmit`, and `handleDeleteTask` with `setErrorMessage('...')` calls using human-readable strings
  - Clear `errorMessage` (set to `null`) at the start of each operation that succeeds
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 4.1 Write property test for API failure produces Error Banner (Property 6)
    - **Property 6: API failure produces Error Banner**
    - For any mutation where the API call rejects, `errorMessage` must be a non-null non-empty string
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [x] 5. Create `EmptyState` component and wire into dashboard
  - Create `frontend/src/components/EmptyState.tsx` — renders a centered `<Box>` with "No tasks found" `<Typography>` and a "Create your first task" `<Button>` that calls the `onCreateTask` prop
  - In `DashboardPage`, render `<EmptyState>` inside the task grid area when `filteredTasks.length === 0 && !loading && !errorMessage`
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 5.1 Write property test for empty state visibility invariant (Property 7)
    - **Property 7: Empty state visibility invariant**
    - Empty state is visible if and only if `filteredTasks.length === 0` and no loading/error state is active
    - **Validates: Requirements 5.1, 5.3**

- [x] 6. Add filter controls to the Dashboard
  - Add `statusFilter: string` (default `'all'`) and `priorityFilter: string` (default `'all'`) state to `DashboardPage`
  - Compute `filteredTasks` as the tasks array filtered by both predicates (use `'all'` to skip each filter)
  - Render the task grid from `filteredTasks` instead of `tasks`
  - Add two MUI `<Select>` controls (Status / Priority) in the header row between the "My Tasks" title and the "New Task" button — each with an "All" option plus their respective enum values
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 6.1 Write property test for filter correctness (Property 3)
    - **Property 3: Filter correctness (conjunctive)**
    - For any task list and any status/priority filter combination, `filteredTasks` contains exactly the tasks satisfying both predicates
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**

- [x] 7. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create `AnalyticsPanel` component
  - Create `frontend/src/components/AnalyticsPanel.tsx`
  - Accept props: `data: AnalyticsData | null`, `unavailable: boolean`
  - When `unavailable` is `true`, render a MUI `<Alert severity="warning">` with "Analytics unavailable"
  - When `data` is non-null, render a `<Paper>` strip (or row of stat cards) showing: Total tasks, Completion %, per-status counts (todo / in-progress / completed), per-priority counts (low / medium / high)
  - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ]* 8.1 Write property test for analytics panel renders all required fields (Property 8)
    - **Property 8: Analytics panel renders all required fields**
    - For any `AnalyticsData` object, the rendered panel must include elements for all required statistics
    - **Validates: Requirements 6.2, 6.3**

- [x] 9. Wire analytics into `DashboardPage`
  - Add `analytics: AnalyticsData | null` and `analyticsUnavailable: boolean` state
  - Implement `fetchAnalytics()` — calls `analyticsService.getAnalytics()`, sets `analytics` on success, sets `analyticsUnavailable(true)` on failure
  - Call `fetchAnalytics()` in the initial `useEffect` alongside `fetchTasks()`
  - Call `fetchAnalytics()` after every successful create, update, and delete
  - Render `<AnalyticsPanel data={analytics} unavailable={analyticsUnavailable} />` above the filter controls
  - _Requirements: 6.1, 6.4, 6.6_

  - [ ]* 9.1 Write property test for analytics re-fetch after mutation (Property 9)
    - **Property 9: Analytics re-fetch after task mutation**
    - For each successful mutation type, `fetchAnalytics` is called exactly once after the operation completes
    - **Validates: Requirements 6.6**

- [x] 10. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Filtering is done client-side using the already-fetched `tasks` array — no new API calls needed for filter changes
- The analytics panel is intentionally isolated from task list errors; a failed analytics fetch must not affect task display
- Property tests should use a testing library compatible with the existing frontend setup (e.g., Vitest + `@testing-library/react` with `fast-check` for property generation)
