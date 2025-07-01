export const API_URL_BASE = "http://localhost:8080/api";

// Función para manejar errores de autenticación
export const handleAuthError = (response: Response) => {
  if (response.status === 401) {
    // Token expirado o inválido, limpiar sesión
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirigir al login
    window.location.href = '/';
    return true; // Indica que se manejó el error
  }
  return false; // No se manejó el error
};

// Función para hacer peticiones con manejo automático de errores de auth
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // Manejar errores de autenticación automáticamente
  if (handleAuthError(response)) {
    throw new Error('Sesión expirada');
  }
  
  return response;
}; 