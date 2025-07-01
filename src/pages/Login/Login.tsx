// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, TextField, Alert, Avatar, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';
import { loginService } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirigir si ya hay una sesión activa
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard/profile');
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginService(email, password);
      // Guardar usuario y token en contexto y localStorage
      const user = data.data.user;
      const accessToken = data.data.token.accessToken;
      const refreshToken = data.data.token.refreshToken;
      login(user, accessToken, refreshToken);
      navigate('/dashboard/profile');
    } catch (err: any) {
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
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
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'   
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: 380,
          borderRadius: 5,
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Stack alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
            <PersonIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Iniciar Sesión
          </Typography>
        </Stack>
        <form onSubmit={handleLogin}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            size="medium"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            size="medium"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3, py: 1.2, fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2, color: 'primary.main', fontWeight: 'bold' }}
          // Sin funcionalidad aún
        >
          {/* Registrarse */}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
