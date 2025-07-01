import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { logoutService } from '../services/authService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para verificar si un token JWT ha expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // Si no se puede decodificar, considerar como expirado
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (user: User, token: string, refreshToken: string) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
      throw new Error('Solo los usuarios con rol Admin o Teacher pueden iniciar sesión en esta plataforma.');
    }
    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    try {
      if (storedRefreshToken) {
        await logoutService(storedRefreshToken);
      }
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      // Limpiar el estado y el almacenamiento local sin importar si el servidor falló
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedUser && storedToken && storedRefreshToken) {
        // Verificar si el token ha expirado
        if (isTokenExpired(storedToken)) {
          // Token expirado, limpiar localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } else {
          // Token válido, restaurar sesión
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
        }
      }
      setIsLoading(false);
    };

    // Simular un pequeño delay para evitar parpadeos
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}; 