import { API_URL_BASE } from '../utils/api';

export interface Course {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  facultyId: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  name: string;
  description: string;
  teacherId: string;
  facultyId: string;
  semester: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getAllCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL_BASE}/courses`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener cursos');
  }
  return data.data;
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await fetch(`${API_URL_BASE}/courses/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener curso');
  }
  return data.data;
}

export async function createCourse(courseData: CreateCourseData): Promise<Course> {
  const res = await fetch(`${API_URL_BASE}/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(courseData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear curso');
  }
  return data.data;
}

export async function updateCourse(id: string, courseData: CreateCourseData): Promise<Course> {
  const res = await fetch(`${API_URL_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(courseData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar curso');
  }
  return data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await fetch(`${API_URL_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar curso');
  }
} 