# API Documentation

## Base URL

### Production

https://project-management-api-g96p.onrender.com/api

### Local Development

http://localhost:5000/api

---

# Authentication

## Register

**POST** `/auth/register`

Creates a new user account.

### Request Body

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "DemoPass123"
}
```

### Authentication

Not required.

---

## Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

### Request Body

```json
{
  "email": "demo@example.com",
  "password": "DemoPass123"
}
```

### Authentication

Not required.

---

## Logout

**POST** `/auth/logout`

Logs out the current user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Current User

**GET** `/auth/me`

Returns the currently authenticated user's information.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

# Projects

## Get Projects

**GET** `/projects`

Returns projects belonging to the authenticated user.

### Query Parameters

Optional:

```text
GET /projects?search=Agro
GET /projects?status=In Progress
```

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Get Project

**GET** `/projects/:id`

Returns a specific project belonging to the authenticated user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Create Project

**POST** `/projects`

Creates a new project for the authenticated user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Update Project

**PUT** `/projects/:id`

Updates an existing project owned by the authenticated user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Delete Project

**DELETE** `/projects/:id`

Deletes a project owned by the authenticated user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

# Tasks

## Get Tasks

**GET** `/tasks`

Returns tasks accessible to the authenticated user.

### Query Parameters

Optional:

```text
GET /tasks?search=login
GET /tasks?status=Completed
GET /tasks?priority=High
GET /tasks?project_id=1
```

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Get Task

**GET** `/tasks/:id`

Returns a specific task belonging to the authenticated user's project.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Create Task

**POST** `/tasks`

Creates a new task under a project owned by the authenticated user.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Update Task

**PUT** `/tasks/:id`

Updates an existing task.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

## Delete Task

**DELETE** `/tasks/:id`

Deletes an existing task.

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

# Dashboard

## Get Dashboard Statistics

**GET** `/dashboard`

Returns summary statistics for the authenticated user's projects and tasks.

The dashboard includes:

- Total Projects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Projects In Progress

### Authentication

Requires:

```text
Authorization: Bearer <token>
```

---

# Query Examples

## Project Search

```text
GET /projects?search=Agro
```

## Project Status Filter

```text
GET /projects?status=In Progress
```

## Task Search

```text
GET /tasks?search=login
```

## Task Status Filter

```text
GET /tasks?status=Completed
```

## Task Priority Filter

```text
GET /tasks?priority=High
```

## Tasks by Project

```text
GET /tasks?project_id=1
```

---

# Authentication Header

Protected endpoints require a JWT access token:

```text
Authorization: Bearer <token>
```

---

# Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Protected routes require a valid authentication token.
- Backend input validation is applied to incoming requests.
- Project ownership is enforced server-side.
- Task access is restricted through project ownership.
- PostgreSQL queries use parameterized values.
- Environment variables are used for secrets and database configuration.