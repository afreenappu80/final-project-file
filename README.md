# EduTrack 2.0 - Student Attendance & Academic Management System

EduTrack 2.0 is a comprehensive web-based platform for managing student attendance, academic marks, assignments, and departmental data. It offers distinct portals for Administrators and Students to streamline educational operations.

## 🚀 Features

### Admin Portal
* **Dashboard Overview:** Real-time statistics, attendance trends, pass percentages, and departmental analytics.
* **Student Management:** Register, update, and remove student profiles.
* **Academic Departments:** Manage departments, branches, and semesters.
* **Subject Assignment:** Create subjects and assign faculty.
* **Attendance Tracking:** Mark and track daily attendance with ease.
* **Marks & Grading:** Publish internal, external, lab, and assignment marks.
* **Assignments:** Post assignments, set due dates, and track student submissions.
* **Notifications:** Send real-time updates and alerts to students.

### Student Portal
* **Student Dashboard:** View upcoming assignments, recent marks, attendance percentage, and CGPA at a glance.
* **My Profile:** View academic and personal details, and see dynamic performance stats.
* **Attendance History:** Check daily attendance logs and total percentage.
* **Marks Progress:** View detailed marks breakdown for every subject.
* **Assignments:** Download assignments and upload file submissions.
* **Alerts & Notifications:** Receive important announcements from admins.

## 🛠️ Technology Stack

* **Frontend:** React.js, Tailwind CSS, Vite, Framer Motion (Animations), Chart.js
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Relational mapping for students, subjects, attendance, and marks)
* **Authentication:** JWT (JSON Web Tokens), bcrypt
* **File Uploads:** Multer (for profile pictures and assignment submissions)

## 📦 Installation & Setup

### Prerequisites
* Node.js (v16 or higher)
* npm (Node Package Manager)

### 1. Clone or Extract the Project
Extract the provided ZIP file and navigate into the project root directory.

### 2. Backend Setup
1. Open a terminal and navigate to the \`server\` directory:
   \`\`\`bash
   cd server
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the backend server (runs on port 5000):
   \`\`\`bash
   npm start
   \`\`\`
   *(Note: The SQLite database \`database.sqlite\` will be automatically initialized with the required tables and a default admin account upon first run).*

### 3. Frontend Setup
1. Open a new terminal and navigate to the \`client\` directory:
   \`\`\`bash
   cd client
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open your browser and navigate to \`http://localhost:5173\`

## 🔐 Default Login Credentials

**Admin Login**
* **Email:** admin@example.com
* **Password:** admin123

*(Student accounts can be created by the Admin from the Student Management panel).*

## 📁 Project Structure

\`\`\`
Student-Attendance-System/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets (Favicons, etc.)
│   ├── src/                # React Source Code
│   │   ├── assets/         # Images and SVG files
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth State)
│   │   ├── layouts/        # Page Layouts (Sidebar, Navbar)
│   │   └── pages/          # Individual Application Pages
│   └── package.json        
├── server/                 # Backend Node.js Application
│   ├── config/             # Database connection & schema setup
│   ├── controllers/        # Route logic and business rules
│   ├── middlewares/        # Authentication & Upload middleware
│   ├── routes/             # Express API routes
│   ├── uploads/            # Uploaded files and assignments
│   └── server.js           # Main Express server entry point
└── README.md
\`\`\`
