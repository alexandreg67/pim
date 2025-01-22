// src/components/admin/UserCreationForm.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { useNotification } from '../../hooks/useNotification';

const translations = {
  messages: {
    success:
      "L'utilisateur {name} a été créé avec succès. Un email avec le mot de passe temporaire a été envoyé à {email}",
    error: "Erreur lors de la création de l'utilisateur",
  },
};

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
        translations.messages.success
          .replace('{name}', `${data.user.firstName} ${data.user.lastName}`)
          .replace('{email}', data.user.email)
      );

      // Réinitialiser le formulaire
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        startDate: null,
        endDate: null,
        role: 'collaborator',
      });
    } catch (err) {
      error(err instanceof Error ? err.message : translations.messages.error);
    } finally {
      setLoading(false);
    }
  };

  const isDateValid = (
    startDate: Date | null,
    endDate: Date | null
  ): boolean => {
    if (!startDate || !endDate) return true;
    return startDate < endDate;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Card>
        <CardHeader
          title="Créer un nouvel utilisateur"
          subheader="Remplissez les informations pour créer un nouveau compte utilisateur"
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                mb: 3,
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
                    error: !isDateValid(formData.startDate, formData.endDate),
                    helperText: !isDateValid(
                      formData.startDate,
                      formData.endDate
                    )
                      ? 'La date de fin doit être après la date de début'
                      : '',
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
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default UserCreationForm;
