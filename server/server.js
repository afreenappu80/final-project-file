const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
crossOriginResourcePolicy: false,
}));

app.use(cors({
origin: [
'http://localhost:5173',
'http://localhost:5174',
'http://localhost:5175',
process.env.CLIENT_URL
].filter(Boolean),
credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Session management
app.use(session({
secret: process.env.SESSION_SECRET || 'secret',
resave: false,
saveUninitialized: false,
cookie: {
secure: process.env.NODE_ENV === 'production',
httpOnly: true,
maxAge: 1000 * 60 * 60 * 24
}
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check
app.get('/api/health', (req, res) => {
res.status(200).json({
status: 'success',
message: 'API is running'
});
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
const clientPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientPath));

// Express 5 compatible SPA fallback
app.get('/{*splat}', (req, res) => {
res.sendFile(path.join(clientPath, 'index.html'));
});
}

// Error handling middleware
app.use((err, req, res, next) => {
console.error(err.stack);

res.status(500).json({
status: 'error',
message: err.message || 'Internal Server Error'
});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
console.log("Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}");
});