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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  TextField,
  DialogActions,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useTagsQuery,
  useUpdateTagMutation,
} from '../generated/graphql-types';
import { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { useDialog } from '../hooks/useDialog';

const TagsPage = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const [createTag, { loading }] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const { data, refetch } = useTagsQuery();

  const { success, error: showError } = useNotification();
  const { confirmDelete } = useDialog();

  const handleOpen = (tag?: {
    id: string;
    name: string;
    description?: string;
  }) => {
    if (tag) {
      setEditingTag(tag.id || null);
      setName(tag.name || '');
      setDescription(tag.description || '');
    } else {
      setEditingTag(null);
      setName('');
      setDescription('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTag(null);
    setName('');
    setDescription('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showError('Le nom est requis');
      return;
    }

    try {
      if (editingTag) {
        // Mode Modifier
        await updateTag({
          variables: {
            id: editingTag,
            input: { name, description },
          },
        });
        success('Tag modifié avec succès', { duration: 3000 });
      } else {
        // Mode Créer
        await createTag({
          variables: {
            input: { name, description },
          },
        });
        success('Tag créé avec succès', { duration: 3000 });
      }
      await refetch();
      handleClose();
    } catch (err) {
      console.error(err);
      showError('Erreur lors de la création du tag');
    }
  };

  const handleDelete = async (tagID: string, tagName: string) => {
    try {
      const confirmed = await confirmDelete(`le tag :  "${tagName}"`);
      if (confirmed) {
        await deleteTag({ variables: { id: tagID } });
        await refetch();
        success('Tag supprimé avec succès', { duration: 3000 });
      }
    } catch (err) {
      console.error(err);
      showError('Une erreur est survenue lors de la suppression');
    }
  };

  const tags = data?.tags || [];

  if (loading) {
    return <Typography variant="h5">Chargement...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h5">Erreur lors du chargement des tags</Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Gestion des Tags</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nouveau Tag
        </Button>
      </Box>

      {/* Table des tags */}
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
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.description}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleOpen({
                          ...tag,
                          description: tag.description || '',
                        })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => handleDelete(tag.id, tag.name)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingTag ? 'Modifier le Tag' : 'Nouveau Tag'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingTag ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagsPage;
