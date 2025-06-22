import { API_URL_BASE } from '../utils/api';

export async function loginService(email: string, password: string) {
  const res = await fetch(`${API_URL_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Usuario o contraseña incorrectos');
  }
  return data;
} 