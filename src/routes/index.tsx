// src/routes/index.tsx
import { useRoutes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import MainLayout from '../components/Layout/MainLayout';
import Home from '../pages/Home/Home';
import PageB from '../pages/PageB/PageB';
import PageC from '../pages/PageC/PageC';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="home" replace /> },
        { path: 'home', element: <Home /> },
        { path: 'pageb', element: <PageB /> },
        { path: 'pagec', element: <PageC /> },
        { path: '*', element: <Navigate to="home" replace /> },
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
