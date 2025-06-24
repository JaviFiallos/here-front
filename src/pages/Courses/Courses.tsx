import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  type Course,
  type CreateCourseData,
} from '../../services/courseService';
import {
  getAllFaculties,
  type Faculty,
} from '../../services/facultyService';
import {
  getAllUsers,
  type User,
} from '../../services/userService';

interface CourseWithDetails extends Course {
  facultyName?: string;
  teacherName?: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithDetails[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CreateCourseData>({
    name: '',
    description: '',
    teacherId: '',
    facultyId: '',
    semester: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = courses;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por facultad
    if (selectedFaculty) {
      filtered = filtered.filter(course =>
        course.facultyId === selectedFaculty
      );
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, selectedFaculty, courses]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, facultiesData, usersData] = await Promise.all([
        getAllCourses(),
        getAllFaculties(),
        getAllUsers(),
      ]);
      
      // Filtrar solo profesores
      const teachersData = usersData.filter(user => user.role === 'teacher');
      
      // Combinar cursos con nombres de facultades y profesores
      const coursesWithDetails = coursesData.map(course => {
        const faculty = facultiesData.find(f => f.id === course.facultyId);
        const teacher = teachersData.find(t => t.id === course.teacherId);
        return {
          ...course,
          facultyName: faculty?.name || 'Facultad no encontrada',
          teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Profesor no asignado',
        };
      });
      
      setCourses(coursesWithDetails);
      setFaculties(facultiesData);
      setTeachers(teachersData);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        description: course.description || '',
        teacherId: course.teacherId || '',
        facultyId: course.facultyId,
        semester: course.semester,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        description: '',
        teacherId: '',
        facultyId: '',
        semester: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      teacherId: '',
      facultyId: '',
      semester: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.facultyId || !formData.semester) return;

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
      } else {
        await createCourse(formData);
      }
      await loadData();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este curso?')) return;

    try {
      await deleteCourse(id);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cursos
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Facultad</InputLabel>
          <Select
            value={selectedFaculty}
            label="Filtrar por Facultad"
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <MenuItem value="">Todas las facultades</MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty.id} value={faculty.id}>
                {faculty.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Crear
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N°</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Facultad</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.facultyName}</TableCell>
                <TableCell>{course.teacherName}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Editar Curso' : 'Crear Curso'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre del curso"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Facultad</InputLabel>
            <Select
              value={formData.facultyId}
              label="Facultad"
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              required
            >
              {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Profesor</InputLabel>
            <Select
              value={formData.teacherId}
              label="Profesor"
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            >
              <MenuItem value="">Sin asignar</MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Semestre</InputLabel>
            <Select
              value={formData.semester}
              label="Semestre"
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              required
            >
              <MenuItem value="Primero">Primero</MenuItem>
              <MenuItem value="Segundo">Segundo</MenuItem>
              <MenuItem value="Tercero">Tercero</MenuItem>
              <MenuItem value="Cuarto">Cuarto</MenuItem>
              <MenuItem value="Quinto">Quinto</MenuItem>
              <MenuItem value="Sexto">Sexto</MenuItem>
              <MenuItem value="Séptimo">Séptimo</MenuItem>
              <MenuItem value="Octavo">Octavo</MenuItem>
              <MenuItem value="Noveno">Noveno</MenuItem>
              <MenuItem value="Décimo">Décimo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCourse ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses; 