import { API_URL_BASE, apiRequest } from '../utils/api';

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  description?: string;
}

export interface CreateFacultyData {
  universityId: string;
  name: string;
  description?: string;
}

export async function getAllFaculties(): Promise<Faculty[]> {
  const res = await apiRequest(`${API_URL_BASE}/faculties`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultades');
  }
  return data.data;
}

export async function getFacultyById(id: string): Promise<Faculty> {
  const res = await apiRequest(`${API_URL_BASE}/faculties/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultad');
  }
  return data.data;
}

export async function getFacultiesByUniversity(universityId: string): Promise<Faculty[]> {
  const res = await apiRequest(`${API_URL_BASE}/faculties/university/${universityId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultades de la universidad');
  }
  return data.data;
}

export async function createFaculty(facultyData: CreateFacultyData): Promise<Faculty> {
  const res = await apiRequest(`${API_URL_BASE}/admin/faculties`, {
    method: 'POST',
    body: JSON.stringify(facultyData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear facultad');
  }
  return data.data;
}

export async function updateFaculty(id: string, facultyData: CreateFacultyData): Promise<Faculty> {
  const res = await apiRequest(`${API_URL_BASE}/admin/faculties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(facultyData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar facultad');
  }
  return data.data;
}

export async function deleteFaculty(id: string): Promise<void> {
  const res = await apiRequest(`${API_URL_BASE}/admin/faculties/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar facultad');
  }
} 