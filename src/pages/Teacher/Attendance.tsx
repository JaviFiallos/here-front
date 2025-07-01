import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { getAllCourses, getSectionsByTeacher, type CourseSection } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { getAttendanceBySchedule } from '../../services/attendanceService';
import type { Attendance } from '../../services/attendanceService';
import { getStudentsBySection } from '../../services/userService';

interface EnrichedSection extends CourseSection {
  courseName: string;
}

const Attendance: React.FC = () => {
  const [mySections, setMySections] = useState<EnrichedSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
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
      } catch (err) {
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (selectedSection) {
      // Cargar estudiantes inscritos
      getStudentsBySection(selectedSection)
        .then(data => setStudents((data.enrollments || []).map((e: any) => e.student)))
        .catch(() => setStudents([]));
      // Cargar asistencia
      getAttendanceBySchedule(selectedSection)
        .then(setAttendance)
        .catch(() => setAttendance([]));
    } else {
      setStudents([]);
      setAttendance([]);
    }
  }, [selectedSection]);

  // Función para obtener el estado de un estudiante
  const getEstado = (studentId: string) => {
    const registro = attendance.find(a => a.studentId === studentId);
    if (!registro) return 'SIN REGISTRO';
    if (registro.status === 'present') return 'PRESENTE';
    if (registro.status === 'late') return 'TARDE';
    if (registro.status === 'obsent') return 'AUSENTE';
    // Agregar validación para otros posibles valores
    return (registro.status as string).toUpperCase();
  };

  const getColor = (estado: string) => {
    if (estado === 'PRESENTE') return { color: 'green', bg: '#e8f5e9' };
    if (estado === 'TARDE') return { color: 'orange', bg: '#fff3e0' };
    if (estado === 'AUSENTE') return { color: 'red', bg: '#ffebee' };
    return { color: 'gray', bg: '#f5f5f5' };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Estado de Asistencia
        </Typography>

        <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
          Visualiza el estado de asistencia de los estudiantes
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper sx={{ p: 2, display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
            <InputLabel>Selecciona una Sección</InputLabel>
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              label="Selecciona una Sección"
              disabled={loading || mySections.length === 0}
            >
              {mySections.map(section => (
                <MenuItem key={section.id} value={section.id}>
                  {section.courseName} - {section.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="Fecha de la clase"
            value={selectedDate}
            onChange={(newDate: Date | null) => setSelectedDate(newDate)}
          />
        </Paper>

        {selectedSection && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Estado de Asistencia - {students.length} estudiantes
            </Typography>
            <List>
              {students.map(student => {
                const estado = getEstado(student.id);
                const { color, bg } = getColor(estado);
                
                return (
                  <ListItem key={student.id} divider sx={{ backgroundColor: 'white' , borderRadius: 2, marginBottom: 1}}>
                    <ListItemText 
                      primary={`${student.firstName} ${student.lastName}`}
                      secondary={`ID: ${student.id}`}
                    />
                    <Box
                      sx={{
                        color,
                        background: bg,
                        fontWeight: 'bold',
                        display: 'inline-block',
                        minWidth: 100,
                        textAlign: 'center',
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        px: 2,
                        py: 0.5,
                      }}
                    >
                      {estado}
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            
            {students.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No hay estudiantes inscritos en esta sección.
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Attendance; 