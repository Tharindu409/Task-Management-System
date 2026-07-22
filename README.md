# Task Management System

## Project Overview

TaskFlow is a full-stack task management application. Authenticated users can create, view, update, search, filter, sort, and delete tasks from a responsive kanban dashboard.

The application includes:

- JWT-based login and logout flow
- Task CRUD functionality
- Status and priority filtering
- Task-title search
- Sorting by newest created, oldest created, or due date
- Pagination
- Light and dark themes
- Loading indicators and toast notifications
- Responsive desktop, tablet, and mobile layouts
- A simple protected Settings page

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- React Icons
- Oxlint
- Node.js built-in test runner for utility tests

### Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- `pg` PostgreSQL client
- JSON Web Tokens
- `bcrypt` password hashing
- `cors`
- `dotenv`
- `tsx` for development

## Project Structure

```text
backend/       Express and TypeScript API
 database/     PostgreSQL schema
frontend/      React and Vite application
```

## Prerequisites

Install the following before starting:

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer

Verify the installations:

```bash
node --version
npm --version
psql --version
```

## Installation Instructions

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Return to the repository root when needed:

```bash
cd ..
```

## Environment Variables

Create `backend/.env` with values for your local PostgreSQL instance:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Taskdb
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=replace_with_a_long_random_secret
```

### Variable reference

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend HTTP port. Defaults to `5000`. |
| `DB_USER` | Yes | PostgreSQL user. |
| `DB_HOST` | Yes | PostgreSQL host, usually `localhost`. |
| `DB_NAME` | Yes | PostgreSQL database name, normally `Taskdb`. |
| `DB_PASSWORD` | Yes | PostgreSQL password. |
| `DB_PORT` | No | PostgreSQL port. Defaults to `5432`. |
| `JWT_SECRET` | Yes for production | Secret used to sign and verify JWTs. |

The backend currently falls back to `supersecretjwtkey` when `JWT_SECRET` is missing. Set a strong secret in every shared or production environment.

The frontend currently uses `http://localhost:5000/api` as its API base URL in `frontend/src/context/AuthContext.jsx`. Change that value when the backend is hosted elsewhere.

## Database Setup

Create the database and tables using the supplied schema:

```bash
psql -U postgres -f database/schema.sql
```

The schema creates:

- `Users`
- `Tasks`

The task table includes:

- `id`
- `user_id`
- `title`
- `description`
- `priority`
- `status`
- `due_date`
- `created_at`
- `updated_at`

The backend also verifies or creates the tables when it starts. The PostgreSQL user configured in `.env` must have permission to connect to the database and create tables.

The schema includes a default demo user:

```text
Email: admin@test.com
Password: 123456
```

Change or remove demo credentials before deploying the application.

## Running the Backend

Development mode with automatic TypeScript reload:

```bash
cd backend
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Build the backend:

```bash
cd backend
npm run build
```

Run the compiled backend:

```bash
cd backend
npm start
```

## Running the Frontend

Start the Vite development server:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

Preview the production build:

```bash
cd frontend
npm run preview
```

Run frontend linting:

```bash
cd frontend
npm run lint
```

Run frontend unit tests:

```bash
cd frontend
npm test
```

## API Documentation

All task endpoints require an `Authorization` header containing a valid JWT:

```http
Authorization: Bearer <token>
```

The API base path is `/api`.

### Authentication

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Successful response includes a JWT and user information:

```json
{
  "message": "Logged in successfully",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.com"
  }
}
```

#### Logout

```http
POST /api/auth/logout
```

JWT logout is completed client-side by removing the stored token. The endpoint returns a confirmation response.

### Tasks

#### List tasks

```http
GET /api/tasks
Authorization: Bearer <token>
```

Returns the authenticated user's tasks ordered by creation date descending.

#### Get one task

```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create a task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "title": "Prepare weekly report",
  "description": "Summarize the team's progress.",
  "priority": "High",
  "status": "Pending",
  "due_date": "2030-01-15T12:00:00.000Z"
}
```

Required fields are `title`, `priority`, `status`, and `due_date`. Valid priorities are `Low`, `Medium`, and `High`. Valid statuses are `Pending`, `In Progress`, and `Completed`.

The due date cannot be earlier than today. `created_at` and `updated_at` are generated by the database.

#### Update a task

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json
```

The request body uses the same fields and validation rules as task creation.

#### Delete a task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

Successful response:

```json
{
  "message": "Task deleted successfully"
}
```

### Common HTTP responses

| Status | Meaning |
| --- | --- |
| `200` | Request succeeded. |
| `201` | Task created successfully. |
| `400` | Invalid input or validation failure. |
| `401` | Authentication is missing or the user is unauthorized. |
| `403` | JWT is invalid or expired. |
| `404` | Task does not exist for the authenticated user. |
| `500` | Unexpected server or database error. |

## Assumptions Made

- PostgreSQL is the only supported database.
- Each task belongs to one authenticated user and users can access only their own tasks.
- Due dates are interpreted as calendar dates for frontend validation and display.
- JWTs remain valid for one day.
- The frontend and backend run locally on ports `5173` and `5000` during development.
- The default demo account is intended for local evaluation only.
- Search, filtering, sorting, and pagination currently happen in the frontend after loading the user's task list.

## Known Limitations

- The frontend API URL is hardcoded to `http://localhost:5000/api` rather than read from a frontend environment variable.
- Logout is client-side token removal; the backend does not maintain a token blacklist.
- There is no password reset, user registration, profile editing, or role management flow.
- Backend automated tests are not currently configured.
- Frontend unit coverage currently focuses on task utility functions rather than full component interaction tests.
- The share and export header controls are visual placeholders and do not currently perform actions.
- PostgreSQL migrations are not versioned; the application uses schema initialization and `CREATE TABLE IF NOT EXISTS` statements.
- CORS is currently enabled broadly for development convenience and should be restricted for production.

## Development Verification

From `frontend/`:

```bash
npm run lint
npm test
npm run build
```

From `backend/`:

```bash
npm run build
```
