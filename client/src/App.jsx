import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentProfile from './pages/StudentProfile';
import AdminStudentManagement from './pages/AdminStudentManagement';
import AdminDepartments from './pages/AdminDepartments';
import AdminSubjects from './pages/AdminSubjects';
import AdminAttendance from './pages/AdminAttendance';
import AdminMarks from './pages/AdminMarks';
import StudentAttendance from './pages/StudentAttendance';
import StudentMarks from './pages/StudentMarks';
import AdminReports from './pages/AdminReports';

// Phase 3 Pages
import AdminAssignments from './pages/AdminAssignments';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminNotifications from './pages/AdminNotifications';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import StudentAssignments from './pages/StudentAssignments';
import StudentNotifications from './pages/StudentNotifications';
import StudentSettings from './pages/StudentSettings';
import StudentAnalytics from './pages/StudentAnalytics';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#fee2e2', color: '#991b1b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong!</h1>
          <p style={{ fontWeight: 'bold' }}>Error: {this.state.error?.toString()}</p>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: '#7f1d1d' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Components
const ProtectedStudentRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'student') return <Navigate to="/student-login" />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/admin-login" />;
  return children;
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<ProtectedStudentRoute><StudentDashboard /></ProtectedStudentRoute>} />
            <Route path="/student/attendance" element={<ProtectedStudentRoute><StudentAttendance /></ProtectedStudentRoute>} />
            <Route path="/student/marks" element={<ProtectedStudentRoute><StudentMarks /></ProtectedStudentRoute>} />
            <Route path="/student/assignments" element={<ProtectedStudentRoute><StudentAssignments /></ProtectedStudentRoute>} />
            <Route path="/student/analytics" element={<ProtectedStudentRoute><StudentAnalytics /></ProtectedStudentRoute>} />
            <Route path="/student/notifications" element={<ProtectedStudentRoute><StudentNotifications /></ProtectedStudentRoute>} />
            <Route path="/student/profile" element={<ProtectedStudentRoute><StudentProfile /></ProtectedStudentRoute>} />
            <Route path="/student/settings" element={<ProtectedStudentRoute><StudentSettings /></ProtectedStudentRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/students" element={<ProtectedAdminRoute><AdminStudentManagement /></ProtectedAdminRoute>} />
            <Route path="/admin/departments" element={<ProtectedAdminRoute><AdminDepartments /></ProtectedAdminRoute>} />
            <Route path="/admin/subjects" element={<ProtectedAdminRoute><AdminSubjects /></ProtectedAdminRoute>} />
            <Route path="/admin/attendance" element={<ProtectedAdminRoute><AdminAttendance /></ProtectedAdminRoute>} />
            <Route path="/admin/assignments" element={<ProtectedAdminRoute><AdminAssignments /></ProtectedAdminRoute>} />
            <Route path="/admin/marks" element={<ProtectedAdminRoute><AdminMarks /></ProtectedAdminRoute>} />
            <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
            <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
            <Route path="/admin/notifications" element={<ProtectedAdminRoute><AdminNotifications /></ProtectedAdminRoute>} />
            <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
