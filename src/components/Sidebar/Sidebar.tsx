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
  Divider,
  Box,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PageviewIcon from '@mui/icons-material/Pageview'; // Icono genérico para PageB
import InfoIcon from '@mui/icons-material/Info'; // Icono genérico para PageC

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
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
    overflowX: 'hidden',
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

  // Definimos las opciones de navegación
  const navItems = [
    {
      text: 'Home',
      icon: <HomeIcon />,
      path: '/dashboard/home',
    },
    {
      text: 'Page B',
      icon: <PageviewIcon />,
      path: '/dashboard/pageb',
    },
    {
      text: 'Page C',
      icon: <InfoIcon />,
      path: '/dashboard/pagec',
    },
  ];

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
      <Divider />

      {/* Zona de usuario */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
        }}
      >
        <Avatar
          src="https://via.placeholder.com/80"
          sx={{ width: 80, height: 80 }}
        />
        {open && (
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Juan Pérez
          </Typography>
        )}
      </Box>
      <Divider />

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
    </StyledDrawer>
  );
};

export default Sidebar;
