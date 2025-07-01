import { API_URL_BASE, apiRequest } from '../utils/api';

export interface Schedule {
  id: string;
  courseId: string;
  sectionId: string;
  classroomId: string;
  dayOfWeek: number; // 1 = lunes, 2 = martes, ..., 7 = domingo
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export async function getSchedulesBySection(sectionId: string): Promise<Schedule[]> {
  const res = await apiRequest(`${API_URL_BASE}/sections/${sectionId}/schedules`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener los horarios');
  return data.data || [];
} 