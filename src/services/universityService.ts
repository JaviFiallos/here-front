import { API_URL_BASE } from '../utils/api';

export interface University {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUniversityData {
  name: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getAllUniversities(): Promise<University[]> {
  const res = await fetch(`${API_URL_BASE}/universities`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener universidades');
  }
  return data.data;
}

export async function getUniversityById(id: string): Promise<University> {
  const res = await fetch(`${API_URL_BASE}/universities/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener universidad');
  }
  return data.data;
}

export async function createUniversity(universityData: CreateUniversityData): Promise<University> {
  const res = await fetch(`${API_URL_BASE}/universities`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(universityData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear universidad');
  }
  return data.data;
}

export async function updateUniversity(id: string, universityData: CreateUniversityData): Promise<University> {
  const res = await fetch(`${API_URL_BASE}/universities/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(universityData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar universidad');
  }
  return data.data;
}

export async function deleteUniversity(id: string): Promise<void> {
  const res = await fetch(`${API_URL_BASE}/universities/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar universidad');
  }
} 