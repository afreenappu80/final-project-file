# Student Attendance and Performance Management System (Phase 1)

## Overview
A modern, responsive, and secure web application designed to manage student attendance, academic performance, and administrative tasks. Phase 1 establishes the core architecture, including database schema, backend APIs, and the frontend user interface.

## Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS v4, React Router, Framer Motion, Axios.
* **Backend:** Node.js, Express.js, MySQL (mysql2), JWT, bcrypt.

## Folder Structure
```
Student-Attendance-System/
├── client/           # React Frontend
├── server/           # Express Backend
├── database/         # SQL Schemas
├── uploads/          # Profile Images
└── docs/             # Documentation
```

## Installation & Setup

1. **Database**
   - Ensure MySQL is running.
   - Run the SQL script located in `database/schema.sql`.

2. **Backend Setup**
   - Navigate to the `server/` directory: `cd server`
   - Install dependencies: `npm install`
   - Create a `.env` file (see `.env.example` or use defaults in `server.js`).
   - Run the server: `npm run dev` (runs on port 5000)

3. **Frontend Setup**
   - Navigate to the `client/` directory: `cd client`
   - Install dependencies: `npm install`
   - Run the frontend: `npm run dev` (runs on port 5173)

## Features Included in Phase 1
- **Modern UI**: Glassmorphism, animations, responsive design, dark mode.
- **Authentication**: JWT-based auth with secure HttpOnly cookies, password hashing.
- **Student Portal**: Registration, Login, Dashboard, Profile Management.
- **Admin Portal**: Login, Dashboard, Full Student CRUD Operations (Search, Filter, Pagination, Soft Delete).
