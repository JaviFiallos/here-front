import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllCourses, getSectionsByTeacher, type CourseSection } from '../../services/courseService';
import { getStudentsBySection } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import { QRCodeCanvas } from 'qrcode.react';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import { getQRCodesBySection } from '../../services/qrCodeService';

interface EnrichedSection extends CourseSection {
  courseName: string;
}

const MyStudents: React.FC = () => {
  const [mySections, setMySections] = useState<EnrichedSection[]>([]);
  const [studentsBySection, setStudentsBySection] = useState<{ [sectionId: string]: any[] }>({});
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [qrSection, setQrSection] = useState<EnrichedSection | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | false>(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [teacherSections, allCourses] = await Promise.all([
          getSectionsByTeacher(user.id),
          getAllCourses()
        ]);
        const enrichedSections = teacherSections.map(section => {
          const course = allCourses.find(c => c.id === section.courseId);
          return {
            ...section,
            courseName: course?.name || 'Curso Desconocido',
          };
        });
        setMySections(enrichedSections);
        setError('');
      } catch (err: any) {
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleSectionExpand = async (sectionId: string) => {
    //console.log('Expandiendo sección:', sectionId);
    if (studentsBySection[sectionId]) return; // Ya cargados
    setLoadingSection(sectionId);
    try {
      const response = await getStudentsBySection(sectionId);
      const students = (response.enrollments || []).map((enrollment: any) => enrollment.student);
      setStudentsBySection(prev => ({ ...prev, [sectionId]: students }));
    } catch (err) {
      setStudentsBySection(prev => ({ ...prev, [sectionId]: [] }));
    } finally {
      setLoadingSection(null);
    }
  };

  const handleGenerateQR = async (section: EnrichedSection) => {
    try {
      const qrList = await getQRCodesBySection(section.id);
      const qr = Array.isArray(qrList) ? qrList[0] : qrList;
      if (!qr) {
        alert('No hay código QR para esta sección');
        return;
      }
      setQrSection(section);
      setQrData(qr);
    } catch (err) {
      alert('Error al obtener el código QR');
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Estudiantes por Sección
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {mySections.length === 0 && !error && (
        <Typography>No tienes secciones asignadas para mostrar estudiantes.</Typography>
      )}

      {mySections.map((section) => {
        const isExpanded = expandedSection === section.id;
        return (
          <Paper
            key={section.id}
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: '#f7fafd', // Fondo suave
              border: '1.5px solid #1976d2', // Azul corporativo
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)'
            }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: '#183153', fontWeight: 600 }}>
                {section.courseName} - {section.name}
              </Typography>
              <Box>
                <IconButton
                  aria-label="Generar QR"
                  size="small"
                  sx={{
                    ml: 1,
                    color: '#1976d2', // Azul principal
                    backgroundColor: '#e3f2fd',
                    '&:hover': { backgroundColor: '#bbdefb' }
                  }}
                  onClick={() => handleGenerateQR(section)}
                >
                  <QrCodeIcon />
                </IconButton>
                <IconButton
                  aria-label={isExpanded ? 'Ocultar estudiantes' : 'Ver estudiantes inscritos'}
                  size="small"
                  sx={{
                    ml: 1,
                    color: isExpanded ? '#1976d2' : '#607d8b', // Azul si está expandido, gris si no
                    backgroundColor: isExpanded ? '#e3f2fd' : '#f5f5f5',
                    '&:hover': { backgroundColor: '#bbdefb' }
                  }}
                  onClick={async () => {
                    if (!isExpanded) {
                      await handleSectionExpand(section.id);
                    }
                    setExpandedSection(isExpanded ? false : section.id);
                  }}
                >
                  <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                </IconButton>
              </Box>
            </Box>
            {isExpanded && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#1976d2', fontWeight: 500 }}>
                  Estudiantes Inscritos
                </Typography>
                <Paper variant="outlined" sx={{ backgroundColor: '#fff' }}>
                  <List>
                    {loadingSection === section.id ? (
                      <Typography>Cargando estudiantes...</Typography>
                    ) : studentsBySection[section.id] ? (
                      studentsBySection[section.id].length === 0
                        ? <Typography>No hay estudiantes inscritos.</Typography>
                        : studentsBySection[section.id].map((student: any, index: number) => (
                            <React.Fragment key={student.id}>
                              <ListItem>
                                <ListItemText primary={`${student.firstName} ${student.lastName}`} sx={{ color: '#183153' }} />
                              </ListItem>
                              {index < studentsBySection[section.id].length - 1 && <Divider sx={{ backgroundColor: '#e3e3e3' }} />}
                            </React.Fragment>
                          ))
                    ) : (
                      <Typography>Haz clic para ver los estudiantes.</Typography>
                    )}
                  </List>
                </Paper>
              </Box>
            )}
          </Paper>
        );
      })}
      {/* Modal QR */}
      <Dialog open={!!qrSection} onClose={() => { setQrSection(null); setQrData(null); }}>
        <DialogTitle>
          Código QR para la sección
          <IconButton
            aria-label="Cerrar"
            onClick={() => { setQrSection(null); setQrData(null); }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {qrSection && qrData && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {qrSection.courseName} - {qrSection.name}
              </Typography>
              <QRCodeCanvas value={JSON.stringify(qrData)} size={220} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>
                Código: {qrData.code}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Expira: {new Date(qrData.expiresAt).toLocaleDateString('es-ES')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Escanea este código para registrar tu asistencia
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyStudents; 