// src/pages/Home.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          textAlign: 'center',
          border:'none'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido a Home
        </Typography>
        <Typography variant="body1">
          Esto es la página principal del Dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;
