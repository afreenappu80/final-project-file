CREATE DATABASE IF NOT EXISTS student_attendance_management;
USE student_attendance_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'student') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other'),
    dob DATE,
    blood_group VARCHAR(5),
    department VARCHAR(100),
    branch VARCHAR(100),
    semester INT,
    section VARCHAR(10),
    year INT,
    address TEXT,
    parent_name VARCHAR(150),
    parent_phone VARCHAR(20),
    profile_image VARCHAR(255),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Note: In a real system, you'd insert a default admin account here.
-- INSERT INTO users (role, email, password) VALUES ('admin', 'admin@example.com', '$2b$10$...hashed_password...');
-- INSERT INTO admins (user_id, username) VALUES (LAST_INSERT_ID(), 'admin');
