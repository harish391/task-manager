# Requirements Document

## Introduction

This document specifies the requirements for completing the Task Manager frontend assessment application. The backend (Express/MongoDB REST API with JWT auth) and Python analytics service are fully functional. The gaps to fill are: adding a status field to the task create/edit dialog, adding status/priority filter controls on the dashboard, improving UX with delete confirmation, surfacing error messages to users, showing an empty state when there are no tasks, and integrating an analytics summary panel that fetches data from the Python service.

## Glossary

- **Dashboard**: The authenticated page at `/dashboard` rendered by `DashboardPage.tsx` that lists all tasks belonging to the current user.
- **Task**: A work item with fields `title`, `description`, `status`, `priority`, `dueDate`, and `userId`, stored in MongoDB and exposed through the Express API.
- **TaskStatus**: An enumeration of valid task statuses: `todo`, `in-progress`, `completed`.
- **TaskPriority**: An enumeration of valid task priorities: `low`, `medium`, `high`.
- **Task Dialog**: The MUI `Dialog` component used to create or edit a task.
- **Filter Controls**: UI elements on the Dashboard that restrict the visible task list to tasks matching selected criteria.
- **Analytics Panel**: A UI section on the Dashboard that displays aggregated statistics fetched from the Python analytics service.
- **Python Service**: The Flask application running at `http://localhost:8000` that exposes `/analytics/tasks` and `/process/task`.
- **AnalyticsData**: The JSON object returned by `GET /analytics/tasks`: `{ total_tasks, tasks_by_status, tasks_by_priority, completion_percentage }`.
- **Error Banner**: An inline, dismissable UI element that surfaces a human-readable error message to the user.
- **Empty State**: A visual placeholder displayed in the task list area when the current user has no tasks matching the active filters.
- **Delete Confirmation Dialog**: A modal that asks the user to confirm before permanently deleting a task.

---

## Requirements

### Requirement 1: Status Field in Task Dialog

**User Story:** As a user, I want to set or change the status of a task when creating or editing it, so that I can accurately track where each task stands.

#### Acceptance Criteria

1. WHEN the Task Dialog is opened, THE Task Dialog SHALL display a `Status` selector containing the options `todo`, `in-progress`, and `completed`.
2. WHEN the Task Dialog is opened to create a new task, THE Task Dialog SHALL pre-select `todo` as the default status value.
3. WHEN the Task Dialog is opened to edit an existing task, THE Task Dialog SHALL pre-populate the `Status` selector with the task's current `status` value.
4. WHEN a user submits the Task Dialog for an existing task, THE Dashboard SHALL send the selected `status` value as part of the update payload to `PUT /tasks/:id`.
5. WHEN a user submits the Task Dialog to create a new task, THE Dashboard SHALL include the selected `status` value in the create payload sent to `POST /tasks`.

---

### Requirement 2: Task Filtering on the Dashboard

**User Story:** As a user, I want to filter my task list by status and priority, so that I can focus on the tasks most relevant to me at any given time.

#### Acceptance Criteria

1. THE Dashboard SHALL display a `Status` filter control with options: `All`, `todo`, `in-progress`, `completed`.
2. THE Dashboard SHALL display a `Priority` filter control with options: `All`, `low`, `medium`, `high`.
3. WHEN both filter controls are set to `All`, THE Dashboard SHALL display all tasks belonging to the current user.
4. WHEN a `Status` filter value is selected, THE Dashboard SHALL display only tasks whose `status` field matches the selected value.
5. WHEN a `Priority` filter value is selected, THE Dashboard SHALL display only tasks whose `priority` field matches the selected value.
6. WHEN both a `Status` and a `Priority` filter value are selected, THE Dashboard SHALL display only tasks that satisfy both filter conditions simultaneously.
7. WHEN a filter value changes, THE Dashboard SHALL apply the new filter immediately without reloading the page.
8. WHEN a filter is active and a task is created or updated such that it no longer matches the active filter, THE Dashboard SHALL exclude that task from the displayed list after the next task fetch completes.

---

### Requirement 3: Delete Confirmation Dialog

**User Story:** As a user, I want to be asked to confirm before a task is deleted, so that I do not accidentally remove tasks.

#### Acceptance Criteria

1. WHEN a user clicks the `Delete` button on a task card, THE Dashboard SHALL display a Delete Confirmation Dialog before any deletion is performed.
2. THE Delete Confirmation Dialog SHALL identify the task being deleted by displaying its `title`.
3. WHEN a user confirms deletion in the Delete Confirmation Dialog, THE Dashboard SHALL call `DELETE /tasks/:id` for that task and remove it from the displayed list on success.
4. WHEN a user cancels the Delete Confirmation Dialog, THE Dashboard SHALL close the dialog and leave the task list unchanged.

---

### Requirement 4: User-Facing Error Messages

**User Story:** As a user, I want to see a clear error message when a create, update, or delete operation fails, so that I know something went wrong and can take action.

#### Acceptance Criteria

1. IF a call to `POST /tasks` fails, THEN THE Dashboard SHALL display an Error Banner with a human-readable message indicating the task could not be created.
2. IF a call to `PUT /tasks/:id` fails, THEN THE Dashboard SHALL display an Error Banner with a human-readable message indicating the task could not be updated.
3. IF a call to `DELETE /tasks/:id` fails, THEN THE Dashboard SHALL display an Error Banner with a human-readable message indicating the task could not be deleted.
4. IF a call to `GET /tasks` fails, THEN THE Dashboard SHALL display an Error Banner with a human-readable message indicating the task list could not be loaded.
5. THE Error Banner SHALL be dismissable by the user.
6. WHEN a subsequent operation succeeds, THE Dashboard SHALL clear any previously displayed Error Banner for that operation type.

---

### Requirement 5: Empty State

**User Story:** As a user, I want to see a helpful message when I have no tasks matching the current filters, so that I understand the list is empty by design rather than a loading failure.

#### Acceptance Criteria

1. WHEN the task list filtered by the current `Status` and `Priority` filters is empty AND no loading or error state is active, THE Dashboard SHALL display an Empty State message in the task list area.
2. THE Empty State SHALL include a brief descriptive message (e.g., "No tasks found") and a prompt or button to create a new task.
3. WHEN at least one task matches the active filters, THE Dashboard SHALL hide the Empty State and display the task cards.

---

### Requirement 6: Analytics Summary Panel

**User Story:** As a user, I want to see an at-a-glance summary of my task statistics on the dashboard, so that I can understand my overall progress without inspecting individual tasks.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Dashboard SHALL request `GET /analytics/tasks` from the Python Service, passing the user's JWT in the `Authorization` header.
2. WHEN the analytics response is received, THE Dashboard SHALL display the following statistics: `total_tasks`, `completion_percentage`, and per-status counts from `tasks_by_status`.
3. WHEN the analytics response is received, THE Dashboard SHALL display per-priority counts from `tasks_by_priority`.
4. IF the `GET /analytics/tasks` request fails, THEN THE Dashboard SHALL display a fallback message indicating analytics are unavailable, and SHALL continue to display the task list normally.
5. THE Analytics Panel SHALL be visually distinct from the task list (e.g., rendered as a summary bar or a row of stat cards above the task list).
6. WHEN a task is created, updated, or deleted, THE Dashboard SHALL refresh the analytics data by re-requesting `GET /analytics/tasks`.
