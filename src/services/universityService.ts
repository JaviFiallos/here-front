import { API_URL_BASE, apiRequest } from '../utils/api';

export interface University {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

export interface CreateUniversityData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

export async function getAllUniversities(): Promise<University[]> {
  const res = await apiRequest(`${API_URL_BASE}/admin/universities`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener universidades');
  }
  return data.data;
}

export async function getUniversityById(id: string): Promise<University> {
  const res = await apiRequest(`${API_URL_BASE}/admin/universities/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener universidad');
  }
  return data.data;
}

export async function createUniversity(universityData: CreateUniversityData): Promise<University> {
  const res = await apiRequest(`${API_URL_BASE}/admin/universities`, {
    method: 'POST',
    body: JSON.stringify(universityData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear universidad');
  }
  return data.data;
}

export async function updateUniversity(id: string, universityData: CreateUniversityData): Promise<University> {
  const res = await apiRequest(`${API_URL_BASE}/admin/universities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(universityData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar universidad');
  }
  return data.data;
}

export async function deleteUniversity(id: string): Promise<void> {
  const res = await apiRequest(`${API_URL_BASE}/admin/universities/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar universidad');
  }
} 