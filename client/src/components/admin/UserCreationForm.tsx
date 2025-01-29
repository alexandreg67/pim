import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { useNotification } from '../../hooks/useNotification';

const UserCreationForm = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    startDate: null,
    endDate: null,
    role: 'collaborator',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la création de l'utilisateur"
        );
      }

      success(
        `L'utilisateur ${data.user.firstName} ${data.user.lastName} a été créé avec succès. Un email avec le mot de passe temporaire a été envoyé à ${data.user.email}`
      );

      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        startDate: null,
        endDate: null,
        role: 'collaborator',
      });
    } catch (err) {
      error(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'utilisateur"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Informations de l&apos;utilisateur
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Remplissez les informations pour créer un nouveau compte
                utilisateur
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                mb: 4,
              }}
            >
              <TextField
                label="Prénom"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                fullWidth
                error={!formData.firstName}
                helperText={!formData.firstName ? 'Ce champ est requis' : ''}
              />

              <TextField
                label="Nom"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                fullWidth
                error={!formData.lastName}
                helperText={!formData.lastName ? 'Ce champ est requis' : ''}
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                fullWidth
                error={!formData.email}
                helperText={!formData.email ? 'Ce champ est requis' : ''}
              />

              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={formData.role}
                  label="Rôle"
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <MenuItem value="admin">Administrateur</MenuItem>
                  <MenuItem value="collaborator">Collaborateur</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                label="Date de début"
                value={formData.startDate}
                onChange={(date) =>
                  setFormData({ ...formData, startDate: date })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    error: !formData.startDate,
                    helperText: !formData.startDate
                      ? 'Ce champ est requis'
                      : '',
                  },
                }}
              />

              <DatePicker
                label="Date de fin"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Création en cours...' : "Créer l'utilisateur"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default UserCreationForm;
