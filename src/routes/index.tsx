// src/routes/index.tsx
import { useRoutes, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Login from '../pages/Login/Login';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import Universities from '../pages/Universities/Universities';
import Faculties from '../pages/Faculties/Faculties';
import Users from '../pages/Users/Users';
import Courses from '../pages/Courses/Courses';
import MyCourses from '../pages/Teacher/MyCourses';
import MyStudents from '../pages/Teacher/MyStudents';
import Attendance from '../pages/Teacher/Attendance';
import Profile from '../pages/Profile/Profile';

type RequireAuthProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  
  // Mostrar loading mientras se valida la sesión
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const { isLoading } = useAuth();
  
  const routes = useRoutes([
    {
      path: '/',
      element: isLoading ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      ) : <Login />,
    },
    {
      path: '/dashboard',
      element: (
        <RequireAuth>
          <MainLayout />
        </RequireAuth>
      ),
      children: [
        // Rutas para admin
        {
          path: 'universidades',
          element: (
            <RequireAuth allowedRoles={['admin']}>
              <Universities />
            </RequireAuth>
          ),
        },
        {
          path: 'facultades',
          element: (
            <RequireAuth allowedRoles={['admin']}>
              <Faculties />
            </RequireAuth>
          ),
        },
        {
          path: 'usuarios',
          element: (
            <RequireAuth allowedRoles={['admin']}>
              <Users />
            </RequireAuth>
          ),
        },
        {
          path: 'cursos',
          element: (
            <RequireAuth allowedRoles={['admin']}>
              <Courses />
            </RequireAuth>
          ),
        },
        // Rutas para teacher
        {
          path: 'mis-cursos',
          element: (
            <RequireAuth allowedRoles={['teacher']}>
              <MyCourses />
            </RequireAuth>
          ),
        },
        {
          path: 'estudiantes',
          element: (
            <RequireAuth allowedRoles={['teacher']}>
              <MyStudents />
            </RequireAuth>
          ),
        },
        {
          path: 'asistencia',
          element: (
            <RequireAuth allowedRoles={['teacher']}>
              <Attendance />
            </RequireAuth>
          ),
        },
        // Ruta compartida
        {
          path: 'profile',
          element: (
            <RequireAuth allowedRoles={['admin', 'teacher', 'student']}>
              <Profile />
            </RequireAuth>
          ),
        },
        { path: '*', element: <Navigate to="profile" replace /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return routes;
};

export default AppRoutes;
