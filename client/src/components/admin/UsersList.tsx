import { useState } from 'react';
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
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Edit, Refresh, CheckCircle, Error } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../generated/graphql-types';
import { authService } from '../../services/authService';
import { useNotification } from '../../hooks/useNotification';
import { useDialog } from '../../hooks/useDialog';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const formatDateWithTime = (date: string | Date) => {
  return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
};

export default function UsersList() {
  const { success, error } = useNotification();
  const { confirm } = useDialog();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    startDate: Date;
    endDate?: Date | null;
  } | null>(null);

  const { data, loading, refetch } = useGetUsersQuery({
    variables: {
      page: page + 1,
      limit: rowsPerPage,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser] = useUpdateUserMutation({
    onCompleted: () => {
      success('Utilisateur mis à jour avec succès');
      setEditingUser(null);
      refetch();
    },
    onError: (err) => {
      error("Erreur lors de la mise à jour de l'utilisateur");
      console.error('Update error:', err);
    },
  });

  // Handlers
  const handleEdit = (user: typeof editingUser) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      await updateUser({
        variables: {
          id: editingUser.id,
          input: {
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            phone: editingUser.phone || null,
            startDate: editingUser.startDate,
            endDate: editingUser.endDate || null,
          },
        },
      });
    } catch (err) {
      console.error('Error updating user:', err);
      error("Une erreur est survenue lors de la mise à jour de l'utilisateur");
    }
  };

  const handleResetPassword = async (userMail: string) => {
    try {
      const confirmed = await confirm({
        title: 'Réinitialisation du mot de passe',
        message:
          'Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ? Un nouveau mot de passe temporaire lui sera envoyé par email.',
        confirmLabel: 'Réinitialiser',
        cancelLabel: 'Annuler',
        color: 'warning',
      });

      if (!confirmed) return;

      await authService.resetPassword(userMail);
      success("Un nouveau mot de passe a été envoyé à l'utilisateur");
    } catch (err) {
      console.error('Erreur dans handleResetPassword:', err);
      error(
        'Une erreur est survenue lors de la réinitialisation du mot de passe'
      );
    }
  };

  // Rendu conditionnel selon l'état
  if (loading && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Liste des utilisateurs</Typography>
        <Button
          startIcon={<Refresh />}
          onClick={() => refetch()}
          variant="outlined"
        >
          Actualiser
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Période d&apos;accès</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {`${user.firstName} ${user.lastName}`}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user.role === 'ADMIN' ? 'Administrateur' : 'Collaborateur'
                    }
                    color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      user.createdAt ? formatDateWithTime(user.createdAt) : ''
                    }
                  >
                    <span>
                      {user.createdAt
                        ? format(new Date(user.createdAt), 'dd/MM/yyyy', {
                            locale: fr,
                          })
                        : ''}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Début:{' '}
                      {format(new Date(user.startDate), 'dd/MM/yyyy', {
                        locale: fr,
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fin:{' '}
                      {user.endDate
                        ? format(new Date(user.endDate), 'dd/MM/yyyy', {
                            locale: fr,
                          })
                        : 'Indéterminée'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      user.isFirstLogin
                        ? "L'utilisateur n'a pas encore changé son mot de passe temporaire"
                        : "L'utilisateur est actif"
                    }
                  >
                    <Chip
                      label={
                        user.isFirstLogin
                          ? 'En attente de 1ère connexion'
                          : 'Actif'
                      }
                      color={user.isFirstLogin ? 'warning' : 'success'}
                      icon={user.isFirstLogin ? <Error /> : <CheckCircle />}
                      size="small"
                    />
                  </Tooltip>
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
                      onClick={() => handleResetPassword(user.email)}
                      color="warning"
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data?.totalUsers || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Lignes par page"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
      />

      <Dialog
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Informations générales
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Prénom"
                value={editingUser?.firstName || ''}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, firstName: e.target.value } : null
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nom"
                value={editingUser?.lastName || ''}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, lastName: e.target.value } : null
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Téléphone"
                value={editingUser?.phone || ''}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
                fullWidth
                margin="normal"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Période d&apos;accès
            </Typography>
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="Date de début"
                value={
                  editingUser?.startDate
                    ? new Date(editingUser.startDate)
                    : null
                }
                onChange={(date) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, startDate: date || new Date() } : null
                  )
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
              <DatePicker
                label="Date de fin"
                value={
                  editingUser?.endDate ? new Date(editingUser.endDate) : null
                }
                onChange={(date) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, endDate: date } : null
                  )
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
