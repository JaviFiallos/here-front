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

interface EnrichedSection extends CourseSection {
  courseName: string;
}

const MyStudents: React.FC = () => {
  const [mySections, setMySections] = useState<EnrichedSection[]>([]);
  const [studentsBySection, setStudentsBySection] = useState<{ [sectionId: string]: any[] }>({});
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [qrSection, setQrSection] = useState<EnrichedSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

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
    if (studentsBySection[sectionId]) return; // Ya cargados
    setLoadingSection(sectionId);
    try {
      const students = await getStudentsBySection(sectionId);
      setStudentsBySection(prev => ({ ...prev, [sectionId]: students }));
    } catch (err) {
      setStudentsBySection(prev => ({ ...prev, [sectionId]: [] }));
    } finally {
      setLoadingSection(null);
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

      {mySections.map((section) => (
        <Accordion
          key={section.id}
          sx={{ mb: 2 }}
          onChange={(_, expanded) => expanded && handleSectionExpand(section.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{section.courseName} - {section.name}</Typography>
            <IconButton
              aria-label="Generar QR"
              size="small"
              sx={{ ml: 2 }}
              onClick={e => { e.stopPropagation(); setQrSection(section); }}
            >
              <QrCodeIcon />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>
              Estudiantes Inscritos
            </Typography>
            <Paper variant="outlined">
              <List>
                {loadingSection === section.id ? (
                  <Typography>Cargando estudiantes...</Typography>
                ) : (
                  (studentsBySection[section.id] || []).length === 0
                    ? <Typography>No hay estudiantes inscritos.</Typography>
                    : studentsBySection[section.id].map((student: any, index: number) => (
                        <React.Fragment key={student.id}>
                          <ListItem>
                            <ListItemText primary={`${student.firstName} ${student.lastName}`} />
                          </ListItem>
                          {index < studentsBySection[section.id].length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                )}
              </List>
            </Paper>
          </AccordionDetails>
        </Accordion>
      ))}
      {/* Modal QR */}
      <Dialog open={!!qrSection} onClose={() => setQrSection(null)}>
        <DialogTitle>
          Código QR para la sección
          <IconButton
            aria-label="Cerrar"
            onClick={() => setQrSection(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {qrSection && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {qrSection.courseName} - {qrSection.name}
              </Typography>
              <QRCodeCanvas value={qrSection.id} size={220} />
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