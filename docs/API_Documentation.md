# API Documentation

## Base URL
`http://localhost:5000/api`

---

## Authentication

### `POST /auth/register`
Register a new student.
- **Body**: `full_name`, `student_id`, `roll_number`, `admission_number`, `email`, `phone`, `password`, `gender`, `dob`, `blood_group`, `department`, `branch`, `semester`, `section`, `year`, `address`, `parent_name`, `parent_phone`
- **Response**: `201 Created`

### `POST /auth/login`
Student login. Returns JWT in HttpOnly cookie.
- **Body**: `email`, `password`
- **Response**: `200 OK` (user info)

### `POST /auth/admin/login`
Admin login.
- **Body**: `username`, `password`
- **Response**: `200 OK` (admin info)

### `POST /auth/logout`
Clears JWT cookie.
- **Response**: `200 OK`

---

## Student Management (Admin Only)
Requires valid JWT and `admin` role.

### `GET /students`
Get paginated list of students.
- **Query Params**: `page`, `limit`, `search`
- **Response**: `200 OK` (array of students, total, page, pages)

### `GET /students/:id`
Get single student by ID.
- **Response**: `200 OK`

### `PUT /students/:id`
Update student details.
- **Body**: `full_name`, `phone`, `department`, etc.
- **Response**: `200 OK`

### `DELETE /students/:id`
Soft delete a student (changes status to Inactive).
- **Response**: `200 OK`

### `PATCH /students/:id/status`
Toggle active/inactive status.
- **Body**: `status` ('Active' | 'Inactive')
- **Response**: `200 OK`

---

## Profile
Requires valid JWT.

### `GET /profile`
Get current user's profile.
- **Response**: `200 OK`

### `PUT /profile`
Update own profile (Student only).
- **Body**: `phone`, `address`, `profile_image`
- **Response**: `200 OK`

### `POST /profile/upload`
Upload profile image.
- **Body**: `multipart/form-data` (field: `image`)
- **Response**: `200 OK` (imageUrl)
