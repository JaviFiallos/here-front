import { API_URL_BASE, apiRequest } from '../utils/api';

export interface CourseSection {
  id: string;
  courseId: string;
  teacherId?: string;
  name: string;
  maxStudents: number;
}

export interface Course {
  id: string;
  name: string;
  facultyId: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  name: string;
  facultyId: string;
  semester: string; // debe ser string numérico
}

export async function getAllCourses(): Promise<Course[]> {
  const res = await apiRequest(`${API_URL_BASE}/courses`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener cursos');
  }
  return data.data;
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await apiRequest(`${API_URL_BASE}/courses/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener curso');
  }
  return data.data;
}

export async function createCourse(courseData: CreateCourseData): Promise<Course> {
  const res = await apiRequest(`${API_URL_BASE}/courses`, {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al crear curso');
  }
  return data.data;
}

export async function updateCourse(id: string, courseData: Partial<CreateCourseData>): Promise<Course> {
  const res = await apiRequest(`${API_URL_BASE}/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al actualizar curso');
  }
  return data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await apiRequest(`${API_URL_BASE}/courses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al eliminar curso');
  }
}

export async function getSectionsByTeacher(teacherId: string): Promise<CourseSection[]> {
  const res = await apiRequest(`${API_URL_BASE}/courses/teacher/${teacherId}/sections`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener las secciones del profesor');
  }
  return data.data;
} 