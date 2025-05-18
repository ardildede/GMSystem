import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import theme from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('../pages/LoginPage'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/StudentDashboard'));
const StudentDashboardLayout = lazy(() => import('../components/layout/StudentDashboard'));
const TranscriptPage = lazy(() => import('../components/student/TranscriptPage'));
const GraduationRequirementsPage = lazy(() => import('../components/student/GraduationRequirementsPage'));
const ManualCheckPage = lazy(() => import('../components/student/ManualCheckPage'));
const DisengagementCertificatesPage = lazy(() => import('../components/student/DisengagementCertificatesPage'));

// Secretary pages
const SecretaryDashboard = lazy(() => import('../pages/SecretaryDashboard'));
const SecretaryTranscriptPage = lazy(() => import('../pages/SecretaryTranscriptPage'));
const SecretaryRankingPage = lazy(() => import('../pages/SecretaryRankingPage'));
const SecretaryNotificationsPage = lazy(() => import('../pages/SecretaryNotificationsPage'));

// Dean's Office pages
const DeansOfficeDashboardPage = lazy(() => import('../pages/DeansOfficeDashboardPage'));
const FacultyRankingPage = lazy(() => import('../pages/deansoffice/FacultyRankingPage'));

// Loading component - positioned fixed to cover the whole screen
const LoadingComponent = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default,
      zIndex: 9999 // To appear above other content
    }}
  >
    <CircularProgress color="primary" size={60} thickness={4} />
    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
      Loading...
    </Typography>
  </Box>
);

// Protected route component to redirect to login if not authenticated
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" replace />;
};

// Route to redirect to appropriate dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'student') {
    return <Navigate to="/student" replace />;
  }
  
  if (user.role === 'secretary') {
    return <Navigate to="/secretary" replace />;
  }

  if (user.role === 'deans_office') {
    return <Navigate to="/deans-office" replace />;
  }
  
  // Later we'll add other roles
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Student Dashboard routes */}
        <Route path="/student" element={<ProtectedRoute element={<StudentDashboard />} />} />
        <Route 
          path="/student/transcript" 
          element={
            <ProtectedRoute 
              element={
                <StudentDashboardLayout>
                  <TranscriptPage />
                </StudentDashboardLayout>
              } 
            />
          } 
        />
        <Route 
          path="/student/requirements" 
          element={
            <ProtectedRoute 
              element={
                <StudentDashboardLayout>
                  <GraduationRequirementsPage />
                </StudentDashboardLayout>
              } 
            />
          } 
        />
        <Route 
          path="/student/manual-check" 
          element={
            <ProtectedRoute 
              element={
                <StudentDashboardLayout>
                  <ManualCheckPage />
                </StudentDashboardLayout>
              } 
            />
          } 
        />
        <Route 
          path="/student/disengagement" 
          element={
            <ProtectedRoute 
              element={
                <StudentDashboardLayout>
                  <DisengagementCertificatesPage />
                </StudentDashboardLayout>
              } 
            />
          } 
        />
        
        {/* Secretary Dashboard routes */}
        <Route path="/secretary" element={<ProtectedRoute element={<SecretaryDashboard />} />} />
        <Route 
          path="/secretary/transcripts" 
          element={<ProtectedRoute element={<SecretaryTranscriptPage />} />} 
        />
        <Route 
          path="/secretary/ranking" 
          element={<ProtectedRoute element={<SecretaryRankingPage />} />} 
        />
        <Route 
          path="/secretary/notifications" 
          element={<ProtectedRoute element={<SecretaryNotificationsPage />} />} 
        />

        {/* Dean's Office Dashboard routes */}
        <Route path="/deans-office" element={<ProtectedRoute element={<DeansOfficeDashboardPage />} />} />
        <Route
          path="/deans-office/faculty-ranking"
          element={<ProtectedRoute element={<FacultyRankingPage />} />}
        />
        
        {/* Redirect root to appropriate dashboard or login */}
        <Route path="/" element={<DashboardRouter />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;