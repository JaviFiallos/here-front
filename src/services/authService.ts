import { API_URL_BASE, apiRequest } from '../utils/api';

export async function loginService(email: string, password: string) {
  const res = await apiRequest(`${API_URL_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Usuario o contraseña incorrectos');
  }
  return data;
}

export async function logoutService(refreshToken: string) {
  const res = await apiRequest(`${API_URL_BASE}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  // Limpiar el localStorage independientemente de la respuesta del servidor
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  if (!res.ok) {
    const data = await res.json();
    // Aunque falle, el cliente ya está "deslogueado".
    // Puedes loguear el error si es necesario para depuración.
    console.error('Error en el logout del servidor:', data.message);
  }
} 