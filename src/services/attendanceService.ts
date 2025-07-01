import { API_URL_BASE, apiRequest } from '../utils/api';

export interface Attendance {
  id: string;
  studentId: string;
  scheduleId: string;
  status: 'present' | 'late' | 'obsent';
  date: string;
  // otros campos si los necesitas
}

export async function getAttendanceBySchedule(scheduleId: string): Promise<Attendance[]> {
  const res = await apiRequest(`${API_URL_BASE}/attendance/class-schedule/${scheduleId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener la asistencia');
  }
  console.log(data);
  return data || [];
} 