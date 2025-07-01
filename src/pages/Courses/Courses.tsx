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
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithDetails[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CreateCourseData>({
    name: '',
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
    try {
      const [coursesData, facultiesData, usersData] = await Promise.all([
        getAllCourses(),
        getAllFaculties(),
        getAllUsers(),
      ]);
      
      // Filtrar solo profesores
      const teachersData = usersData.filter(user => user.role === 'teacher');
      
      // Combinar cursos con nombres de facultades
      const coursesWithDetails = coursesData.map(course => {
        const faculty = facultiesData.find(f => f.id === course.facultyId);
        return {
          ...course,
          facultyName: faculty?.name || 'Facultad no encontrada',
        };
      });
      
      setCourses(coursesWithDetails);
      setFaculties(facultiesData);
      setTeachers(teachersData);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        facultyId: course.facultyId,
        semester: course.semester,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
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
      facultyId: '',
      semester: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.facultyId || !formData.semester) return;

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          name: formData.name,
          facultyId: formData.facultyId,
          semester: String(formData.semester),
        });
      } else {
        await createCourse({
          name: formData.name,
          facultyId: formData.facultyId,
          semester: String(formData.semester),
        });
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
      setError('');
    } catch (err: any) {
      setError('No se puede eliminar el curso porque tiene datos relacionados');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
          sx={{ flexGrow: 1, minWidth: 200 ,backgroundColor: 'white', border:0}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 ,backgroundColor: 'white', border:0}}>
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
              <TableCell>Semestre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{course.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{course.facultyName}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(course)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(course.id)}
                    color="error"
                  >
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
          {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre del curso"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Facultad</InputLabel>
            <Select
              value={formData.facultyId}
              label="Facultad"
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            >
              {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Semestre</InputLabel>
            <Select
              value={formData.semester}
              label="Semestre"
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            >
              <MenuItem value="1">Primero</MenuItem>
              <MenuItem value="2">Segundo</MenuItem>
              <MenuItem value="3">Tercero</MenuItem>
              <MenuItem value="4">Cuarto</MenuItem>
              <MenuItem value="5">Quinto</MenuItem>
              <MenuItem value="6">Sexto</MenuItem>
              <MenuItem value="7">Séptimo</MenuItem>
              <MenuItem value="8">Octavo</MenuItem>
              <MenuItem value="9">Noveno</MenuItem>
              <MenuItem value="10">Décimo</MenuItem>
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