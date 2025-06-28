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
  Button,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { getAllCourses, getSectionsByTeacher, type CourseSection } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

// Mock data, como en MyStudents.tsx
// TODO: Reemplazar con llamadas a la API.
const mockStudents = [
  { id: 'student-1', firstName: 'Juan', lastName: 'Perez' },
  { id: 'student-2', firstName: 'Ana', lastName: 'Gomez' },
  { id: 'student-3', firstName: 'Luis', lastName: 'Martinez' },
];

type AttendanceStatus = 'presente' | 'ausente' | 'tarde';

interface EnrichedSection extends CourseSection {
  courseName: string;
}

const Attendance: React.FC = () => {
  const [mySections, setMySections] = useState<EnrichedSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
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

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    // TODO: Implementar la lógica para guardar la asistencia en el backend.
    // Se necesitará un endpoint (ej: POST /api/attendance) que reciba
    // el sectionId, la fecha, y un array de estudiantes con su estado.
    alert('Asistencia guardada (simulación):\n' + JSON.stringify({
      sectionId: selectedSection,
      date: selectedDate?.toISOString().split('T')[0],
      records: attendance,
    }, null, 2));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Registro de Asistencia
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
              Estudiantes
            </Typography>
            <List>
              {mockStudents.map(student => (
                <ListItem key={student.id} divider>
                  <ListItemText primary={`${student.firstName} ${student.lastName}`} />
                  <ButtonGroup>
                    <Button
                      variant={attendance[student.id] === 'presente' ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => handleStatusChange(student.id, 'presente')}
                    >
                      Presente
                    </Button>
                    <Button
                      variant={attendance[student.id] === 'tarde' ? 'contained' : 'outlined'}
                      color="warning"
                      onClick={() => handleStatusChange(student.id, 'tarde')}
                    >
                      Tarde
                    </Button>
                    <Button
                      variant={attendance[student.id] === 'ausente' ? 'contained' : 'outlined'}
                      color="error"
                      onClick={() => handleStatusChange(student.id, 'ausente')}
                    >
                      Ausente
                    </Button>
                  </ButtonGroup>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSaveAttendance}
                disabled={Object.keys(attendance).length === 0}
              >
                Guardar Asistencia
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Attendance; 