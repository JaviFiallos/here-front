// src/components/Layout/MainLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const getTitleFromPath = (pathname: string): string => {
  switch (pathname) {
    case '/dashboard/home':
      return 'Inicio';
    case '/dashboard/estudiantes':
      return 'Mis Estudiantes por Sección';
    case '/dashboard/mis-cursos':
      return 'Mis Cursos';
    case '/dashboard/asistencia':
      return 'Registro de Asistencia';
    // Agrega aquí más rutas según tu app
    default:
      return '';
  }
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'   }}>
      {/* Sidebar */}
      <Box sx={{
        //borderRight: '1.5px solid #e3e3e3',
        backgroundColor: '#fff',
        minHeight: '100vh',
        display: 'flex',
      }}>
        <Sidebar />
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header dinámico */}
        {/* <Header title={title} /> */}

        {/* Contenedor principal flexible */}
        <Box
          sx={{
            borderRadius: 4,
            p: 3,
            mt: 2,
          }}
        >
          <Outlet />
        </Box>
        {/* Footer si lo necesitas */}
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default MainLayout;
