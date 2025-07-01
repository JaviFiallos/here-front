import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Divider, 
  Stack, 
  Chip,
  Card,
  CardContent
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Typography>No hay usuario autenticado.</Typography>;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'error';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 0,
        m: 0,
      }}
    >
      <Paper sx={{ 
        p: 4, 
        minWidth: 400, 
        maxWidth: 600, 
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Stack alignItems="center" spacing={3}>
          <Avatar sx={{ 
            width: 120, 
            height: 120, 
            bgcolor: 'primary.main',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '4px solid white'
          }}>
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Chip 
              label={capitalize(user.role)} 
              color={getRoleColor(user.role) as any}
              variant="filled"
              sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
            />
          </Box>
        </Stack>
        
        <Divider sx={{ my: 3, opacity: 0.3 }} />
        
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
          Información del Perfil
        </Typography>
        
        <Stack spacing={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <EmailIcon color="primary" sx={{ fontSize: 28 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <BadgeIcon color="primary" sx={{ fontSize: 28 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Rol en el Sistema
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {capitalize(user.role)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {typeof (user as any).createdAt === 'string' && (
            <Card sx={{ 
              background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CalendarTodayIcon color="primary" sx={{ fontSize: 28 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      Miembro desde
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {new Date((user as any).createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile; 