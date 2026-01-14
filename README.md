# Vehicle Management System – Bullwork Mobility Assignment

A full-stack, role-based vehicle management and telemetry system built as part of the Bullwork Mobility hiring assignment.  
The project demonstrates secure authentication, role-based access control (RBAC), vehicle assignment workflows, and telemetry visualization.

---

## 🔑 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Supported roles:
  - **Admin**
  - **User**
- Protected APIs using middleware
- Secure password hashing

---

## 🛠️ Backend Overview

### Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Backend Functionalities

#### 1. Authentication
- Login using email and password
- JWT token returned containing `userId` and `role`
- Middleware for role-based route protection

#### 2. User Management (Admin)
- Create users
- List users
- Update user details
- Delete users

#### 3. Vehicle Management (Admin)
- Create vehicles (name, number)
- List all vehicles
- Get vehicle details
- Update vehicle details
- Delete vehicles

#### 4. Vehicle Assignment
- Assign vehicles to users
- Reassign vehicles
- Users can view **only their assigned vehicles**

#### 5. Telemetry API
Provides telemetry data for a vehicle.

Sample response:
```json
{
  "speed": [10, 15, 20, 18, 22],
  "battery": [100, 95, 90, 85, 80],
  "temperature": [30, 31, 32, 33, 34],
  "gps": {
    "lat": 18.52,
    "lng": 73.85
  },
  "lastUpdated": "2026-01-14T07:35:01.859Z"
}
