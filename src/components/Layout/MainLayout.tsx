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
    case '/dashboard/pageb':
      return 'Página B';
    case '/dashboard/pagec':
      return 'Página C';
    default:
      return '';
  }
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header dinámico */}
        <Header title={title} />

        {/* Contenido */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', backgroundColor: '#FFF6F3' }}>

          <Outlet />
          
        </Box>

        {/* Footer fijo dentro del flujo */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
