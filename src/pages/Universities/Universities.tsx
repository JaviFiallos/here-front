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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  type University,
  type CreateUniversityData,
} from '../../services/universityService';

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    const filtered = universities.filter(university =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUniversities(filtered);
  }, [searchTerm, universities]);

  const loadUniversities = async () => {
    setLoading(true);
    try {
      const data = await getAllUniversities();
      setUniversities(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (university?: University) => {
    if (university) {
      setEditingUniversity(university);
      setFormData({ name: university.name });
    } else {
      setEditingUniversity(null);
      setFormData({ name: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUniversity(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingUniversity) {
        await updateUniversity(editingUniversity.id, formData);
      } else {
        await createUniversity(formData);
      }
      await loadUniversities();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta universidad?')) return;

    try {
      await deleteUniversity(id);
      await loadUniversities();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Universidades
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
              <TableCell>Universidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUniversities.map((university, index) => (
              <TableRow key={university.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{university.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(university)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(university.id)}>
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
          {editingUniversity ? 'Editar Universidad' : 'Crear Universidad'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la universidad"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUniversity ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Universities; 