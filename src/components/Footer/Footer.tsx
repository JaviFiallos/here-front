// src/components/Footer/Footer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        textAlign: 'center',
        mt: 1,
        backgroundColor: '#f1f1f1',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
