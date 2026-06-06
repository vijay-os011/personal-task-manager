# Personal Task Manager

This project implements Exercise 1: Personal Task Manager from the Studio Graphene Full Stack Developer assessment. It is a small full-stack task manager where a single user can create, view, update, complete, filter, search, reorder, and delete personal tasks without authentication.

## Live Demo Links

**App (frontend)**: `https://vijay-os011.github.io/personal-task-manager` <br/>
**API (backend)**: `https://personal-task-manager-laik.onrender.com`

## Tech Stack

- React with Vite for a fast frontend setup using functional components and hooks.
- Plain CSS for styling, responsive layout, loading/error states, overdue styling, drag handles, and empty states.
- `lucide-react` for familiar action icons.
- `@dnd-kit` for drag-and-drop task reordering.
- Node.js with Express for a clear REST API.
- JSON file storage for persistence across server restarts without requiring a database.
- Vitest and Supertest for meaningful backend API tests.

## How to Run Locally

Assuming Node.js is installed. From the project root:

```bash
npm install
npm run dev
```

App (frontend): `http://127.0.0.1:5173`<br/>
API (backend): `http://localhost:4000`

To run tests:

```bash
npm test
```

To build the frontend:

```bash
npm run build
```

## API Documentation

### `GET /api/health`

Checks that the API is running.

Response:

```json
{
  "ok": true
}
```

### `GET /api/tasks`

Returns tasks in saved task order. New tasks appear first by default until the user reorders the list.

Optional query params:

- `status=all`
- `status=active`
- `status=completed`

Response:

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "dueDate": "2026-06-10",
      "completed": false,
      "position": 0,
      "createdAt": "2026-06-05T09:00:00.000Z",
      "updatedAt": "2026-06-05T09:00:00.000Z"
    }
  ]
}
```

### `POST /api/tasks`

Creates a new task.

Request body:

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-06-10"
}
```

Response:

```json
{
  "task": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2026-06-10",
    "completed": false,
    "position": 0,
    "createdAt": "2026-06-05T09:00:00.000Z",
    "updatedAt": "2026-06-05T09:00:00.000Z"
  }
}
```

### `PUT /api/tasks/:id`

Updates a task. Any editable field can be sent.

Request body:

```json
{
  "title": "Buy groceries and vegetables",
  "description": "Milk, eggs, bread, spinach",
  "dueDate": "2026-06-11",
  "completed": true
}
```

Response:

```json
{
  "task": {
    "id": "uuid",
    "title": "Buy groceries and vegetables",
    "description": "Milk, eggs, bread, spinach",
    "dueDate": "2026-06-11",
    "completed": true,
    "position": 0,
    "createdAt": "2026-06-05T09:00:00.000Z",
    "updatedAt": "2026-06-05T09:10:00.000Z"
  }
}
```

### `PATCH /api/tasks/reorder`

Persists the task order after drag-and-drop. The request must include every task id exactly once.

Request body:

```json
{
  "orderedIds": ["first-task-id", "second-task-id", "third-task-id"]
}
```

Response:

```json
{
  "tasks": [
    {
      "id": "first-task-id",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "dueDate": "2026-06-10",
      "completed": false,
      "position": 0,
      "createdAt": "2026-06-05T09:00:00.000Z",
      "updatedAt": "2026-06-05T09:12:00.000Z"
    }
  ]
}
```

### `DELETE /api/tasks/:id`

Deletes a task.

Response:

```text
204 No Content
```

Error response shape:

```json
{
  "error": "Title is required."
}
```

## Project Structure

```text
.
|-- client
|   |-- src
|   |   |-- components     Task form, toolbar, list, and item components
|   |   |-- lib            API and task helper functions
|   |   |-- App.jsx        React app state and task actions
|   |   |-- main.jsx       React entry point
|   |   `-- styles.css     Responsive app styling
|   `-- package.json
|-- server
|   |-- data              JSON task storage lives here at runtime
|   |-- src
|   |   |-- app.js         Express app and routes
|   |   |-- app.test.js    Backend API tests
|   |   |-- server.js      Local server entry point
|   |   |-- store.js       JSON file persistence
|   |   `-- tasks.js       Task validation and transformation helpers
|   `-- package.json
|-- package.json          Workspace scripts
`-- README.md
```

## Next Steps

- Add frontend component tests for form submission, filtering, and empty states.
- Add pagination or archiving if the task list grows large.
