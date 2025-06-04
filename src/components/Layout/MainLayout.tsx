// src/layout/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../Sidebar/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar (Drawer) */}
      <Sidebar />

      {/* Contenido principal: se ajusta para dejar espacio al Drawer */}
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {/* Toolbar vacía para que el contenido quede debajo del AppBar si existiera. */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
