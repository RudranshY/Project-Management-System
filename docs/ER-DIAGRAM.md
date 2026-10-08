# Entity Relationship Diagram

## Overview

The Project Management System uses PostgreSQL with three main tables:

- `users`
- `projects`
- `tasks`

## Relationships

```text
User 1 ─────────── N Projects
                     │
                     │
                     ▼
                   Tasks
```

A user can own multiple projects.

A project can contain multiple tasks.

---

## Users

Table: `users`

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key | Unique user identifier |
| `full_name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt password hash |
| `created_at` | TIMESTAMP | NOT NULL | Account creation time |

---

## Projects

Table: `projects`

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key | Unique project identifier |
| `user_id` | INTEGER | Foreign Key | References `users.id` |
| `name` | VARCHAR(150) | NOT NULL | Project name |
| `description` | TEXT | — | Project description |
| `status` | VARCHAR(20) | NOT NULL | Project status |
| `start_date` | DATE | — | Project start date |
| `end_date` | DATE | — | Project end date |
| `created_at` | TIMESTAMP | NOT NULL | Project creation time |

---

## Tasks

Table: `tasks`

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key | Unique task identifier |
| `project_id` | INTEGER | Foreign Key | References `projects.id` |
| `name` | VARCHAR(150) | NOT NULL | Task name |
| `description` | TEXT | — | Task description |
| `priority` | VARCHAR(10) | NOT NULL | Low / Medium / High |
| `status` | VARCHAR(20) | NOT NULL | Pending / In Progress / Completed |
| `due_date` | DATE | — | Task due date |
| `created_at` | TIMESTAMP | NOT NULL | Task creation time |

---

## Foreign Key Relationships

### User → Projects

```text
projects.user_id → users.id
```

Relationship:

```text
One User → Many Projects
```

Each project belongs to one user.

### Project → Tasks

```text
tasks.project_id → projects.id
```

Relationship:

```text
One Project → Many Tasks
```

Each task belongs to one project.

---

## Cascade Delete

The database uses `ON DELETE CASCADE` for both foreign key relationships.

```text
Delete User
    ↓
User's Projects are deleted
    ↓
Related Tasks are deleted
```

```text
Delete Project
    ↓
Related Tasks are deleted
```

---

## Project Status

Allowed values:

```text
Not Started
In Progress
Completed
```

---

## Task Status

Allowed values:

```text
Pending
In Progress
Completed
```

---

## Task Priority

Allowed values:

```text
Low
Medium
High
```

---

## Project Date Constraint

The project end date cannot be earlier than the start date.

```text
end_date >= start_date
```

Either date can also be `NULL`.

---

## Indexes

### Projects

```text
idx_projects_user_id
idx_projects_status
```

### Tasks

```text
idx_tasks_project_id
idx_tasks_status
idx_tasks_priority
```

---

## Database Schema File

The complete reproducible PostgreSQL schema is available at:

```text
backend/database/schema.sql
```