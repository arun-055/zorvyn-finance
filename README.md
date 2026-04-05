Finance Dashboard Backend
A backend API for a finance dashboard system with role-based access control, built as a backend development internship assignment.

Table of Contents
------------------------
Project Overview
Tech Stack
Project Structure
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

3. Tech Stack
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






