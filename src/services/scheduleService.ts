import { API_URL_BASE, apiRequest } from '../utils/api';

export async function getSchedulesBySection(sectionId: string) {
  const res = await apiRequest(`${API_URL_BASE}/sections/${sectionId}/schedules`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener los horarios de la sección');
  }
  console.log(data.data)
  return data.data; // Ajusta según la estructura real de la respuesta
} 