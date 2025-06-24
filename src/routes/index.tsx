// src/routes/index.tsx
import { useRoutes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import Universities from '../pages/Universities/Universities';
import Faculties from '../pages/Faculties/Faculties';
import Users from '../pages/Users/Users';
import Courses from '../pages/Courses/Courses';

type RequireAuthProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Login />,
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
              <div>Mis Cursos</div>
            </RequireAuth>
          ),
        },
        {
          path: 'estudiantes',
          element: (
            <RequireAuth allowedRoles={['teacher']}>
              <div>Estudiantes</div>
            </RequireAuth>
          ),
        },
        {
          path: 'asistencia',
          element: (
            <RequireAuth allowedRoles={['teacher']}>
              <div>Asistencia</div>
            </RequireAuth>
          ),
        },
        // Ruta compartida
        {
          path: 'profile',
          element: (
            <RequireAuth allowedRoles={['admin', 'teacher']}>
              <div>Profile</div>
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
