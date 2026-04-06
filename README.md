Finance Dashboard Backend
A backend API for a finance dashboard system with role-based access control, built as a backend development internship assignment.
Note: I got introduced by a new amazing concept "Pagination" . I believe it's a very important process in production. I am currenting going through the DOCs to grasp its workflow.I will implement this soon.

Table of Contents
------------------------
Project Overview
Tech Stack
Project Structure
Set up and Installation
Environment Variables
Role System and Access Control
API Documentation
Authentication
User Management
Financial Records
Dashboard and Analytics
Error Handling
Pagination
Assumptions Made
Tradeoffs Considered

1. Project Overview
This is the backend for a finance dashboard system where different users interact with financial records based on their assigned role.
The system supports:

2. Tech Stack
Admins managing users and financial records with full CRUD access
Analysts viewing records and accessing advanced analytics
Viewers seeing basic records and a summary dashboard
JWT-based authentication protecting every protected route
An audit data that tracks every admin action.

Node.js -> Fast and widely used for REST APIs
Express.js -> Minimal and flexible
MongoDB + Mongoose -> Flexible schema, modulization for analytics
JWT -> Stateless token based auth
bcryptjs -> Industry standard for password hashing
express-validator -> Clean per field validation with clear error messages
nodemon -> Auto restarts server on file changes

3. Project Structure

finance-backend/
-->backend
-> src/
    |lib/
        -- db.js                   
    | models/
        -- User.js                 
        -- FinanceRecord.js     
        -- Auditdata.js            
    | middleware/
        -- auth.js                
        -- roleAccess.js                
    | validations/
        -- userValidation.js        
        -- recordValidation.js    
    | controllers/
        -- auth.controller.js      
        -- user.controller.js      
        -- record.controller.js    
        -- dashboard.controller.js 
    | routes/
        -- auth.routes.js
        -- user.routes.js
        -- record.routes.js
        -- dashboard.routes.js
    | utils/
        -- Response.js             
-> .env
-> .env.example
->.gitignore
-> package.json
-> server.js
---
4. Setup and Installation

-> Prerequisites
- Node.js v18 or higher
- MongoDB running locally, or a MongoDB Atlas connection string

-> Steps

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd finance-backend

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in your MONGO_URL and JWT_SECRET

# 4. Start the server
npm run dev      # development mode (nodemon, auto-restart)
npm start        # production mode
```

Server starts at `http://localhost:5001`

You should see in the terminal:
```
Server running on port 5001
MongoDB connected: localhost
```

---

5. Environment Variables
Created a .env file in the root folder .
Port the server runs on 5001
MONGO_URL from mongodb connection
JWT_SECRET in .env
JWT_EXPIRES_IN

6. Role System and Access Control
Three roles exist in the system. Each has a level number used for hierarchy comparison.

viewer - level 1 -  Read records, basic dashboard summary, category breakdown
analyst - level 2 - Everything viewer can do + monthly trends, weekly trends, insights
admin -   level 3 - Full access — manage users, create/update/delete records, audit data

How it is enforced
Two middleware functions in src/middleware/roleAccess.js handle this:
requireRole("admin") — only that exact role is allowed
Used on: POST /records, PATCH /records/:id, DELETE /records/:id, all /users routes
requireMinRole("analyst") — that role and anything above it passes
requireMinRole("analyst") → analyst and admin pass. viewer is blocked.
requireMinRole("viewer")  → all authenticated roles pass.
Access denied response
json{
  "success": false,
  "message": "Access denied. Minimum required role: analyst. Your role: viewer."
}
Admin safety guards

Admin cannot change their own role
Admin cannot deactivate their own account
Admin cannot delete their own account

These prevent accidental system lockout.

7. API Documentation
All protected routes require this header:

All responses follow this consistent shape:
json{
  "success": true,
  "message": "Description of what happened",
  "data": { }
}

7.1 Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | All roles | Get your own profile |

- POST /api/auth/signup

**Request body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "viewer"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | Yes | 2–100 characters |
| email | string | Yes | Valid email format |
| password | string | Yes | Minimum 6 characters |
| role | string | No | `viewer`, `analyst`, or `admin`. Defaults to `viewer` |

**Success response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "viewer",
      "isActive": true
    }
  }
}
```
---

#### POST /api/auth/login

**Request body:**
```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "viewer"
    }
  }
}
```

> The error message for wrong credentials is always "Invalid email or password." — it never reveals which one is wrong. This prevents attackers from checking which emails are registered in the system.

---

#### GET /api/auth/me

No body needed. Just send the Bearer token.

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "viewer",
      "isActive": true,
      "createdAt": "2024-06-01T10:00:00.000Z"
    }
  }
}
```

---
### 7.2 User Management (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users with optional filters |
| GET | `/api/users/audit-data` | View full audit trail |
| GET | `/api/users/:id` | Get a single user by ID |
| PATCH | `/api/users/:id` | Update name, role, or active status |
| DELETE | `/api/users/:id` | Permanently delete a user |

---
**Success response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "name": "Alice",
        "email": "alice@example.com",
        "role": "viewer",
        "isActive": true,
        "createdAt": "2024-06-01T10:00:00.000Z"
      }
    ],
```
ll fields are optional. Only send what you want to change.

**Request body:**
```json
{
  "name": "Alice Updated",
  "role": "analyst",
  "isActive": false
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Alice Updated",
      "role": "analyst",
      "isActive": false
    }
  }
}
```
#### GET /api/users/audit-logs

Returns every admin action — who did it, what they did, what changed, and when.

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "...",
        "performedBy": {
          "name": "Admin User",
          "email": "admin@test.com"
        },
        "action": "DELETE_RECORD",
        "targetModel": "FinancialRecord",
        "targetId": "665f1a2b3c4d5e6f7a8b9c0d",
        "changes": {
          "deletedRecord": {
            "amount": 50000,
            "type": "income",
            "category": "salary"
          }
        },
        "createdAt": "2024-06-15T10:32:00.000Z"
      }
    ]

}
```
### 7.3 Financial Records

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/records` | All roles | List records with filters and pagination |
| GET | `/api/records/:id` | All roles | Get a single record by ID |
| POST | `/api/records` | Admin only | Create a new financial record |
| PATCH | `/api/records/:id` | Admin only | Update a record |
| DELETE | `/api/records/:id` | Admin only | Permanently delete a record |

**Valid categories:**
`salary`, `freelance`, `investment`, `business`, `food`, `transport`, `utilities`, `rent`, `healthcare`, `entertainment`, `education`, `shopping`, `taxes`, `other`

---

#### GET /api/records

Optional query parameters:

| Param | Description | Example |
|---|---|---|
| type | Filter by type | `?type=expense` |
| category | Filter by category | `?category=rent` |
| startDate | From this date (inclusive) | `?startDate=2024-01-01` |
| endDate | Up to this date (inclusive) | `?endDate=2024-06-30` |
| page | Page number, default 1 | `?page=2` |
| limit | Records per page, default 20, max 100 | `?limit=10` |

**Combined filter example:**
```
GET /api/records?type=expense&category=food&startDate=2024-01-01&endDate=2024-06-30&page=1&limit=10
```

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "amount": 3000,
        "type": "expense",
        "category": "food",
        "date": "2024-06-10T00:00:00.000Z",
        "description": "Groceries",
        "createdBy": {
          "name": "Admin User",
          "email": "admin@test.com"
        },
        "createdAt": "2024-06-10T08:00:00.000Z"
      }
}
};
```
#### POST /api/records

**Request body:**
```json
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2024-06-01",
  "description": "June salary"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| amount | number | Yes | Must be greater than 0 |
| type | string | Yes | `income` or `expense` |
| category | string | Yes | Must be a valid category from the list above |
| date | date | No | ISO 8601 format (e.g. `2024-06-01`). Defaults to today |
| description | string | No | Max 500 characters |

**Success response (201):**
```json
{
  "success": true,
  "message": "Record created successfully.",
  "data": {
    "record": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "amount": 50000,
      "type": "income",
      "category": "salary",
      "date": "2024-06-01T00:00:00.000Z",
      "description": "June salary",
      "createdBy": "665f000000000000000000aa",
      "createdAt": "2024-06-01T10:00:00.000Z"
    }
  }
}
```

---

#### PATCH /api/records/:id

All fields are optional. Only send what you want to change.

**Request body:**
```json
{
  "amount": 52000,
  "description": "June salary revised"
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Record updated successfully.",
  "data": {
    "record": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "amount": 52000,
      "type": "income",
      "category": "salary",
      "description": "June salary revised"
    }
  }
}
```

---

#### DELETE /api/records/:id

No body needed. Permanently deletes the record and writes an audit log entry.

**Success response (200):**
```json
{
  "success": true,
  "message": "Record deleted successfully.",
  "data": {}
}
```

---
### 7.4 Dashboard and Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | All roles | Total income, expenses, net balance, recent 5 transactions |
| GET | `/api/dashboard/categoryWise` | All roles | Income and expense totals per category |
| GET | `/api/dashboard/monthly-trends` | Analyst + Admin | Monthly totals for past N months |
| GET | `/api/dashboard/weekly-trends` | Analyst + Admin | Daily totals for the past 7 days |
| GET | `/api/dashboard/insights` | Analyst + Admin | Advanced analytics |

---
## 8. Error Handling

Every error response follows this consistent shape:

```json
{
  "success": false,
  "message": "Clear description of what went wrong."
}
```

Validation errors (422) include a per-field breakdown:

```json
{
  "success": false,
  "errors": [
    { "path": "amount",   "msg": "Amount must be a positive number" },
    { "path": "type",     "msg": "Type must be income or expense" },
    { "path": "category", "msg": "Invalid category" }
  ]
}
```

**HTTP status codes used:**

| Code | When it is used |
|---|---|
| `200` | Request succeeded |
| `201` | New resource created |
| `400` | Invalid MongoDB ID format in the URL |
| `401` | No token, invalid token, or expired token |
| `403` | Valid token but user's role does not have permission |
| `404` | Record or user not found |
| `409` | Duplicate email on registration |
| `422` | Input validation failed |
| `500` | Unexpected server error |

---
## 10. Assumptions Made

1. (Registration is open) — anyone can register and choose their own role. In a real product, only admins would invite users and assign roles. This was kept open to make testing and evaluation easier.

2. (No soft delete*) — users and records are permanently deleted. An audit log entry is written before every deletion so the action is always traceable.

3. (Viewers can read all records) — the assignment said viewers have limited access. I interpreted this as: viewers can read anything but can never write, update, or delete.

4. (Advanced analytics can do analyst and admin only) — basic summary (totals and recent transactions) is available to all roles. Trend analysis and insights are restricted to analyst and admin because they reveal business-level patterns beyond simple record viewing.

5. (Every record stores who created it) — the `createdBy` field on every financial record references the admin who created it. This is important for traceability in a finance system.

---
## 11. Tradeoffs Considered

|---|---|---|
> Permanent delete -> Simple and clean -> Cannot undo. Mitigated by audit log writing a snapshot before deletion |
> Best things i learned Page-based pagination(but not fully applied as i was very new to this concept) -> Easy to implement and understand -> Less efficient than cursor-based on very large datasets .
> Open registration with role selection -> Easy to test all roles during evaluation -> Not secure for a real product
> I used MongoDB -> Flexible schema, great aggregation for analytics -> A relational DB like PostgreSQL would give stronger data integrity with foreign key constraints .
> Used Single JWT secret for secure authentication-> Simple setup and configuration -> Rotating secrets or per-user token invalidation would be more secure in production .

