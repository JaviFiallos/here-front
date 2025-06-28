import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { getAllCourses, getSectionsByTeacher, type Course } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { getAllFaculties } from '../../services/facultyService';

interface CourseWithFaculty extends Course {
  facultyName?: string;
}

const MyCourses: React.FC = () => {
  const [myCourses, setMyCourses] = useState<CourseWithFaculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadMyCourses = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const [teacherSections, allCourses, allFaculties] = await Promise.all([
          getSectionsByTeacher(user.id),
          getAllCourses(),
          getAllFaculties()
        ]);
        
        const teacherCourseIds = [...new Set(teacherSections.map(section => section.courseId))];

        const coursesWithFaculty = allCourses
          .filter(course => teacherCourseIds.includes(course.id))
          .map(course => {
            const faculty = allFaculties.find(f => f.id === course.facultyId);
            return {
              ...course,
              facultyName: faculty?.name || 'Facultad no encontrada',
            };
          });

        setMyCourses(coursesWithFaculty);
        setError('');
      } catch (err: any) {
        console.error('Error detallado al cargar datos:', err);
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, [user]);

  if (loading) {
    return <Typography>Cargando mis cursos...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Cursos
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {myCourses.length === 0 && !error && (
        <Typography>No tienes cursos asignados.</Typography>
      )}

      {myCourses.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre del Curso</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Semestre</TableCell>
                <TableCell>Facultad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.facultyName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyCourses; 