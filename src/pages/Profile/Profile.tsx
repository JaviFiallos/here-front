import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Paper, Avatar, Divider, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Typography>No hay usuario autenticado.</Typography>;

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, minWidth: 350, maxWidth: 500, borderRadius: 4, boxShadow: 3 }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>Perfil</Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Información personal
        </Typography>
        <Stack spacing={1}>
          <Typography><b>Nombre:</b> {user.firstName} {user.lastName}</Typography>
          <Typography><b>Email:</b> {user.email}</Typography>
          <Typography><b>Rol:</b> {capitalize(user.role)}</Typography>
          {typeof (user as any).createdAt === 'string' && (
            <Typography><b>Miembro desde:</b> {new Date((user as any).createdAt).toLocaleDateString()}</Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile; 