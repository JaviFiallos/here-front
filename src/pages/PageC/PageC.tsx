// src/pages/PageC.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PageC: React.FC = () => {
  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Página C
        </Typography>
        <Typography variant="body1">
          Contenido de la Página C dentro del Dashboard.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PageC;
