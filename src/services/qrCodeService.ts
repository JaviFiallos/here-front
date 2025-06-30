import { API_URL_BASE, apiRequest } from '../utils/api';

export async function getQRCodesBySection(sectionId: string) {
  const res = await apiRequest(`${API_URL_BASE}/qrcodes/course-section/${sectionId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error al obtener el QR de la sección');
  }
  console.log(data)
  return data; // Puede ser un array de QRs
}   