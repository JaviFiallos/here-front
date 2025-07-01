// src/components/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Box,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PageviewIcon from '@mui/icons-material/Pageview'; // Icono genérico para PageB
import InfoIcon from '@mui/icons-material/Info'; // Icono genérico para PageC
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

// Anchos del Drawer: desplegado vs plegado.
const DRAWER_WIDTH_OPEN = 240;
const DRAWER_WIDTH_CLOSED = 60;

// Creamos un Drawer personalizado que cambia su ancho según props.
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  borderRadius: 0,
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
    overflowX: 'hidden',
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
    backdropFilter: 'blur(8px)', // Efecto glassmorphism
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Sidebar: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Opciones de menú según el rol
  const adminNavItems = [
    { text: 'Profile', icon: <Avatar sx={{ width: 24, height: 24 }} />, path: '/dashboard/profile' },
    { text: 'Universidades', icon: <HomeIcon />, path: '/dashboard/universidades' },
    { text: 'Facultades', icon: <PageviewIcon />, path: '/dashboard/facultades' },
    { text: 'Usuarios', icon: <InfoIcon />, path: '/dashboard/usuarios' },
    { text: 'Cursos', icon: <InfoIcon />, path: '/dashboard/cursos' },
  ];
  const teacherNavItems = [
    { text: 'Profile', icon: <Avatar sx={{ width: 24, height: 24 }} />, path: '/dashboard/profile' },
    { text: 'Mis Cursos', icon: <HomeIcon />, path: '/dashboard/mis-cursos' },
    { text: 'Estudiantes', icon: <PageviewIcon />, path: '/dashboard/estudiantes' },
    { text: 'Asistencia', icon: <InfoIcon />, path: '/dashboard/asistencia' },
  ];
  const navItems = user?.role === 'admin' ? adminNavItems : teacherNavItems;

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      {/* Botón para desplegar/plegar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          padding: (theme) => theme.spacing(1),
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Zona de usuario */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
        }}
      >
        <Avatar sx={{ width: 56, height: 56 }}>
          {user?.firstName?.[0] || '?'}
        </Avatar>
        {open && (
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
          </Typography>
        )}
      </Box>

      {/* Lista de opciones */}
      <List>
        {navItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              selected={selected}
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          );
        })}
      </List>

      {/* Opción de Cerrar sesión */}
      <List sx={{ mt: 'auto' }}>
        <ListItemButton
          onClick={() => {
            logout();
            navigate('/');
          }}
          sx={{
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            <LogoutIcon sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          {open && <ListItemText primary="Cerrar sesión" />}
        </ListItemButton>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
