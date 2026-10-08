# Project Management System

A full-stack project management system with a React web application and React Native Android application sharing the same REST API and PostgreSQL database.

## Features

- User registration, login and logout
- JWT authentication with bcrypt password hashing
- Project CRUD
- Task CRUD and task completion
- Dashboard statistics
- Search and filtering
- Server-side ownership protection
- Responsive web application
- Android mobile application
- Secure mobile token storage
- Cross-platform data synchronization

## Tech Stack

**Web:** React, Vite, React Router, Axios

**Mobile:** React Native, Expo, Expo Router, Expo SecureStore

**Backend:** Node.js, Express.js, PostgreSQL, JWT, bcrypt, express-validator

**Deployment:** Vercel, Render, Expo EAS

## Architecture

```text
React Web ───────┐
                 │
                 ▼
          Express REST API
                 │
                 ▼
          PostgreSQL Database
                 ▲
                 │
React Native ────┘
```

Both web and Android use the same backend API and production PostgreSQL database.

## Project Structure

```text
project-management-system/
├── backend/
├── frontend/
├── mobile/
├── docs/
│   ├── API.md
│   └── ER-DIAGRAM.md
├── README.md
└── .gitignore
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## Environment Variables

Example files:

```text
backend/.env.example
frontend/.env.example
mobile/.env.example
```

Actual `.env` files are excluded from Git.

## Database Setup

The project uses PostgreSQL.

### Local Database

1. Create a PostgreSQL database named `project_management`.
2. Configure the database connection in `backend/.env`.
3. Run the schema from:

```text
backend/database/schema.sql
```

The schema creates the `users`, `projects`, and `tasks` tables, along with foreign keys, constraints and indexes.

### Production Database

The production database is hosted on Render PostgreSQL.

The same schema is applied using:

```text
backend/database/schema.sql
```

The production backend receives its database connection through the `DATABASE_URL` environment variable.

## Mobile with Deployed Backend

The Android application uses the same deployed backend as the web application.

Production API:

```text
https://project-management-api-g96p.onrender.com/api
```

The mobile application receives this URL through:

```text
EXPO_PUBLIC_API_URL
```

For the EAS production build, the variable is configured in the EAS `production` environment.

The Android application does not depend on `localhost` or the developer's local network when using the production build.

## API Documentation

[API Documentation](docs/API.md)

## Database Documentation

[ER Diagram](docs/ER-DIAGRAM.md)

Database schema:

```text
backend/database/schema.sql
```

## Deployment

### Web

https://project-management-system-sigma-eight.vercel.app

### Backend

https://project-management-api-g96p.onrender.com

### API Base URL

https://project-management-api-g96p.onrender.com/api

### Android

The Android APK is built using Expo EAS. The download link will be added after the build completes.

## Security

- Passwords are hashed using bcrypt.
- JWT protects authenticated routes.
- Backend input validation is implemented.
- Project and task ownership is enforced server-side.
- PostgreSQL queries use parameterized values.
- Secrets are stored in environment variables and excluded from Git.