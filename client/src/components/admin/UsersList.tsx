import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  TablePagination,
} from '@mui/material';
import { Edit, Block, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  startDate: string;
  endDate?: string;
  isFirstLogin: boolean;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/auth/users?page=${page + 1}&limit=${rowsPerPage}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      await fetch(`http://localhost:8000/auth/users/${editingUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await fetch(`http://localhost:8000/auth/reset-password/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      // Add success notification
    } catch (error) {
      console.error('Error:', error);
      // Add error notification
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Paper sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user.role === 'admin' ? 'Administrateur' : 'Collaborateur'
                    }
                    color={user.role === 'admin' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(user.startDate), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>
                  {user.endDate
                    ? format(new Date(user.endDate), 'dd MMMM yyyy', {
                        locale: fr,
                      })
                    : 'Non définie'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isFirstLogin ? 'En attente' : 'Actif'}
                    color={user.isFirstLogin ? 'warning' : 'success'}
                    icon={user.isFirstLogin ? <Block /> : <CheckCircle />}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Réinitialiser le mot de passe">
                    <IconButton
                      size="small"
                      onClick={() => handleResetPassword(user.id)}
                      color="warning"
                    >
                      <Block />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Prénom"
              value={formData.firstName || ''}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nom"
              value={formData.lastName || ''}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Téléphone"
              value={formData.phone || ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date de fin"
              type="date"
              value={formData.endDate?.split('T')[0] || ''}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        component="div"
        count={-1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Lignes par page"
      />
    </Paper>
  );
}
