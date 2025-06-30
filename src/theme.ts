import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul corporativo
      light: '#e3f2fd',
      dark: '#183153',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F4F1F8', // Gris profesional
    },
    background: {
      default: '#F4F1F8', // Fondo general suave
      paper: '#fff',      // Fondo de tarjetas blanco
    },
    text: {
      primary: '#183153', // Texto principal
      secondary: '#607d8b', // Texto secundario
    },
    divider: '#e3e3e3', // Divider gris claro
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#fff', // Tarjetas blancas
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#1976d2',
          backgroundColor: '#e3f2fd',
          '&:hover': { backgroundColor: '#bbdefb' },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          color: '#183153',
          fontWeight: 600,
        },
        subtitle1: {
          color: '#1976d2',
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#e3e3e3',
        },
      },
    },
  },
});

export default theme; 