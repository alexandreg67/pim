import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tooltip,
  Alert,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../generated/graphql-types';
import { useNotification } from '../hooks/useNotification';
import { useDialog } from '../hooks/useDialog';

const CategoriesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data, loading: queryLoading, refetch } = useCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const { success, error: showError } = useNotification();
  const { confirmDelete } = useDialog();

  const categories = data?.categories || [];

  const handleOpenDialog = (category: {
    id?: string;
    name?: string;
    description?: string;
  }) => {
    if (category) {
      setEditingCategory(category.id || null);
      setName(category.name || '');
      setDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!name) {
      showError('Le nom de la catégorie est requis');
      return;
    }
    setLoading(true);
    try {
      if (editingCategory) {
        // Mode Modifier
        await updateCategory({
          variables: {
            id: editingCategory,
            input: { name, description },
          },
        });
        success('Catégorie modifiée avec succès', { duration: 3000 });
      } else {
        // Mode Créer
        await createCategory({
          variables: {
            input: { name, description },
          },
        });
        success('Catégorie créée avec succès', { duration: 3000 });
      }
      await refetch();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      showError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    try {
      const confirmed = await confirmDelete(`la catégorie "${categoryName}"`);
      if (confirmed) {
        await deleteCategory({ variables: { id: categoryId } });
        await refetch();
        success('Catégorie supprimée avec succès', { duration: 3000 });
      }
    } catch (err) {
      console.error(err);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 3 }}>
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">Gestion des Catégories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog({})}
          >
            Nouvelle Catégorie
          </Button>
        </Box>
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Chargement des données...
                      </TableCell>
                    </TableRow>
                  ) : categories.length > 0 ? (
                    categories
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Modifier">
                              <IconButton
                                onClick={() =>
                                  handleOpenDialog({
                                    ...category,
                                    description: category.description || '',
                                  })
                                }
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton
                                onClick={() =>
                                  handleDelete(category.id, category.name)
                                }
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Aucun élément trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={categories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                  setRowsPerPage(parseInt(event.target.value, 10))
                }
                labelRowsPerPage="Lignes par page"
              />
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {name ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <LinearProgress />}
            <TextField
              label="Nom de la catégorie"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {name ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
