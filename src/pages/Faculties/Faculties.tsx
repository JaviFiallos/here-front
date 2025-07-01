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
  getAllFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  type Faculty,
  type CreateFacultyData,
} from '../../services/facultyService';
import {
  getAllUniversities,
  type University,
} from '../../services/universityService';

interface FacultyWithUniversity extends Faculty {
  universityName?: string;
}

const Faculties: React.FC = () => {
  const [faculties, setFaculties] = useState<FacultyWithUniversity[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<FacultyWithUniversity[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState<CreateFacultyData>({
    universityId: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = faculties;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(faculty =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por universidad
    if (selectedUniversity) {
      filtered = filtered.filter(faculty =>
        faculty.universityId === selectedUniversity
      );
    }
    
    setFilteredFaculties(filtered);
  }, [searchTerm, selectedUniversity, faculties]);

  const loadData = async () => {
    try {
      const [facultiesData, universitiesData] = await Promise.all([
        getAllFaculties(),
        getAllUniversities(),
      ]);
      
      // Combinar facultades con nombres de universidades
      const facultiesWithUniversityNames = facultiesData.map(faculty => {
        const university = universitiesData.find(u => u.id === faculty.universityId);
        return {
          ...faculty,
          universityName: university?.name || 'Universidad no encontrada',
        };
      });
      
      setFaculties(facultiesWithUniversityNames);
      setUniversities(universitiesData);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (faculty?: Faculty) => {
    if (faculty) {
      setEditingFaculty(faculty);
      setFormData({
        universityId: faculty.universityId,
        name: faculty.name,
        description: faculty.description || '',
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        universityId: '',
        name: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFaculty(null);
    setFormData({
      universityId: '',
      name: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.universityId) return;

    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, formData);
      } else {
        await createFaculty(formData);
      }
      await loadData();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta facultad?')) return;

    try {
      await deleteFaculty(id);
      await loadData();
      setError('');
    } catch (err: any) {
      setError('No se puede eliminar la facultad porque tiene datos relacionados');
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
        Facultades
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
          <InputLabel>Filtrar por Universidad</InputLabel>
          <Select
            value={selectedUniversity}
            label="Filtrar por Universidad"
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <MenuItem value="">Todas las universidades</MenuItem>
            {universities.map((university) => (
              <MenuItem key={university.id} value={university.id}>
                {university.name}
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
              <TableCell>Facultad</TableCell>
              <TableCell>Universidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFaculties.map((faculty, index) => (
              <TableRow key={faculty.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{faculty.name}</Typography>
                    {faculty.description && (
                      <Typography variant="body2" color="text.secondary">
                        {faculty.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{faculty.universityName}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(faculty)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(faculty.id)}
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
          {editingFaculty ? 'Editar Facultad' : 'Crear Nueva Facultad'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la facultad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Universidad</InputLabel>
            <Select
              value={formData.universityId}
              label="Universidad"
              onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
            >
              {universities.map((university) => (
                <MenuItem key={university.id} value={university.id}>
                  {university.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFaculty ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Faculties; 