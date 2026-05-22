# DevPulse 🚀

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** `https://next-level-assignment-2-zeta.vercel.app`

---

## Features

- User registration & login with JWT authentication
- Role-based access control (contributor & maintainer)
- Create, view, update, and delete issues
- Filter & sort issues by type, status, and date
- Secure password hashing with bcrypt
- Modular, clean TypeScript architecture

---

## Tech Stack

| Technology   | Usage                              |
|--------------|------------------------------------|
| Node.js      | LTS runtime (24.x)                 |
| TypeScript   | Strict typing throughout           |
| Express.js   | Modular router architecture        |
| PostgreSQL   | Relational database (native pg)    |
| Raw SQL      | Direct pool.query() — no ORM       |
| bcrypt       | Password hashing                   |
| jsonwebtoken | JWT generation & verification      |

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/khalidhossain5000/Next-Level-Assignment-2
cd Next-Level-Assignment-2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_CONNECTION_STRING=your_postgresql_connection_string
JWT_TOKEN_SECRET=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=10
```

### 4. Set up the database

Run the following SQL to create the required tables:

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NOT NULL,
  type         VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status       VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id  INTEGER NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);
```

### 5. Run the server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Access | Description              |
|--------|--------------------|--------|--------------------------|
| POST   | /api/auth/signup   | Public | Register a new user      |
| POST   | /api/auth/login    | Public | Login and receive JWT    |

### Issues

| Method | Endpoint         | Access                        | Description                  |
|--------|------------------|-------------------------------|------------------------------|
| POST   | /api/issues      | Authenticated                 | Create a new issue           |
| GET    | /api/issues      | Public                        | Get all issues (with filters)|
| GET    | /api/issues/:id  | Public                        | Get a single issue           |
| PATCH  | /api/issues/:id  | Maintainer / Issue Owner      | Update an issue              |
| DELETE | /api/issues/:id  | Maintainer only               | Delete an issue              |

### Query Parameters — GET /api/issues

| Param  | Values                          | Default |
|--------|---------------------------------|---------|
| sort   | newest, oldest                  | newest  |
| type   | bug, feature_request            | (none)  |
| status | open, in_progress, resolved     | (none)  |

**Example:** `GET /api/issues?sort=oldest&type=bug&status=open`

---

## Request & Response Examples

### POST /api/auth/signup
```json
// Request Body
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

### POST /api/auth/login
```json
// Request Body
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor"
    }
  }
}
```

### POST /api/issues
```json
// Headers: Authorization: <JWT_TOKEN>
// Request Body
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}

// Response 201
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

## Database Schema

### users
| Column     | Type        | Constraints                              |
|------------|-------------|------------------------------------------|
| id         | SERIAL      | PRIMARY KEY                              |
| name       | VARCHAR     | NOT NULL                                 |
| email      | VARCHAR     | NOT NULL, UNIQUE                         |
| password   | TEXT        | NOT NULL (hashed, never returned)        |
| role       | VARCHAR     | DEFAULT 'contributor', contributor/maintainer |
| created_at | TIMESTAMP   | DEFAULT NOW()                            |
| updated_at | TIMESTAMP   | DEFAULT NOW()                            |

### issues
| Column      | Type      | Constraints                                    |
|-------------|-----------|------------------------------------------------|
| id          | SERIAL    | PRIMARY KEY                                    |
| title       | VARCHAR   | NOT NULL, max 150 chars                        |
| description | TEXT      | NOT NULL, min 20 chars                         |
| type        | VARCHAR   | bug / feature_request                          |
| status      | VARCHAR   | DEFAULT 'open', open/in_progress/resolved      |
| reporter_id | INTEGER   | NOT NULL (references users.id)                 |
| created_at  | TIMESTAMP | DEFAULT NOW()                                  |
| updated_at  | TIMESTAMP | DEFAULT NOW()                                  |

---

## User Roles & Permissions

| Action                  | Contributor        | Maintainer |
|-------------------------|--------------------|------------|
| Register / Login        | ✅                 | ✅         |
| View all issues         | ✅                 | ✅         |
| Create issue            | ✅                 | ✅         |
| Update own issue        | ✅ (status: open)  | ✅         |
| Update any issue        | ❌                 | ✅         |
| Delete issue            | ❌                 | ✅         |
| Access system metrics   | ❌                 | ✅         |

---

## HTTP Status Codes

| Code | Meaning               | Usage                                      |
|------|-----------------------|--------------------------------------------|
| 200  | OK                    | Successful GET, PATCH, DELETE              |
| 201  | Created               | Successful POST                            |
| 400  | Bad Request           | Validation errors, invalid input           |
| 401  | Unauthorized          | Missing or invalid JWT                     |
| 403  | Forbidden             | Valid token but insufficient permissions   |
| 404  | Not Found             | Resource does not exist                    |
| 409  | Conflict              | Business logic conflict                    |
| 500  | Internal Server Error | Unexpected server or database error        |

---

## Project Structure

```
src/
├── config/         # Database connection & environment config
├── middleware/      # Auth, role verification, error handling
├── modules/
│   ├── auth/       # Signup & login routes, controllers, services
│   └── issues/     # Issue CRUD routes, controllers, services
├── types/          # TypeScript interfaces & types
├── utils/          # Response formatters, validators, helpers
└── app.ts          # Express app entry point
```

---

## Deployment

- **Backend:** [Render](https://render.com) / [Railway](https://railway.app) / [Vercel](https://vercel.com)
- **Database:** [NeonDB](https://neon.tech) / [Supabase](https://supabase.com) / [ElephantSQL](https://www.elephantsql.com)

Make sure the following environment variables are set in your deployment platform:

```env
PORT=5000
DB_CONNECTION_STRING=your_postgresql_connection_string
JWT_TOKEN_SECRET=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=10
```