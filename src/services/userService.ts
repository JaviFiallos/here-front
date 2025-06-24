import { API_URL_BASE } from '../utils/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL_BASE}/admin/users`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener usuarios');
  }
  return data.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${API_URL_BASE}/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener usuario');
  }
  return data.data;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const res = await fetch(`${API_URL_BASE}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear usuario');
  }
  return data.data;
}

export async function updateUser(id: string, userData: Omit<CreateUserData, 'password'>): Promise<User> {
  const res = await fetch(`${API_URL_BASE}/admin/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar usuario');
  }
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_URL_BASE}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar usuario');
  }
}

export const roleTranslations = {
  admin: 'Administrador',
  teacher: 'Profesor',
  student: 'Estudiante',
} as const; 