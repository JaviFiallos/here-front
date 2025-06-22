import { API_URL_BASE } from '../utils/api';

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  locationLat: number;
  locationLng: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyData {
  universityId: string;
  name: string;
  locationLat: number;
  locationLng: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getAllFaculties(): Promise<Faculty[]> {
  const res = await fetch(`${API_URL_BASE}/faculties`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultades');
  }
  return data.data;
}

export async function getFacultyById(id: string): Promise<Faculty> {
  const res = await fetch(`${API_URL_BASE}/faculties/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultad');
  }
  return data.data;
}

export async function getFacultiesByUniversity(universityId: string): Promise<Faculty[]> {
  const res = await fetch(`${API_URL_BASE}/faculties/university/${universityId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener facultades de la universidad');
  }
  return data.data;
}

export async function createFaculty(facultyData: CreateFacultyData): Promise<Faculty> {
  const res = await fetch(`${API_URL_BASE}/faculties`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(facultyData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear facultad');
  }
  return data.data;
}

export async function updateFaculty(id: string, facultyData: CreateFacultyData): Promise<Faculty> {
  const res = await fetch(`${API_URL_BASE}/faculties/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(facultyData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar facultad');
  }
  return data.data;
}

export async function deleteFaculty(id: string): Promise<void> {
  const res = await fetch(`${API_URL_BASE}/faculties/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar facultad');
  }
} 