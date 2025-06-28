import { API_URL_BASE, apiRequest } from '../utils/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  universityId?: string;
  facultyId?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'teacher' | 'student';
  universityId?: string;
  facultyId?: string;
}

export async function getAllUsers(): Promise<User[]> {
  const res = await apiRequest(`${API_URL_BASE}/admin/users`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener usuarios');
  }
  return data.data;
}

export async function getUserById(id: string): Promise<User> {
  const res = await apiRequest(`${API_URL_BASE}/admin/users/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener usuario');
  }
  return data.data;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const res = await apiRequest(`${API_URL_BASE}/admin/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear usuario');
  }
  return data.data;
}

export async function updateUser(id: string, userData: Omit<CreateUserData, 'password'>): Promise<User> {
  const res = await apiRequest(`${API_URL_BASE}/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar usuario');
  }
  return data.data;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await apiRequest(`${API_URL_BASE}/admin/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar usuario');
  }
}

export async function getStudentsBySection(sectionId: string) {
  const res = await apiRequest(`${API_URL_BASE}/courses/sections/${sectionId}/students`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener estudiantes de la sección');
  }
  return data.data;
}

export const roleTranslations = {
  admin: 'Administrador',
  teacher: 'Profesor',
  student: 'Estudiante',
} as const; 