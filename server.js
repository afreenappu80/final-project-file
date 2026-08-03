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
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./authRoutes'));
app.use('/api/students', require('./studentRoutes'));
app.use('/api/profile', require('./profileRoutes'));
app.use('/api/departments', require('./departmentRoutes'));
app.use('/api/subjects', require('./subjectRoutes'));
app.use('/api/attendance', require('./attendanceRoutes'));
app.use('/api/marks', require('./marksRoutes'));
app.use('/api/notifications', require('./notificationRoutes'));
app.use('/api/reports', require('./reportRoutes'));
app.use('/api/assignments', require('./assignmentRoutes'));
app.use('/api/dashboard', require('./dashboardRoutes'));
app.use('/api/analytics', require('./analyticsRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
