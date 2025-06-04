// src/pages/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí podrías agregar lógica real de autenticación.
    // Por simplicidad, redirigimos directamente al Dashboard.
    navigate('/dashboard/home');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 320,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        {/* Aquí podrías añadir campos de usuario/contraseña, etc. */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
