import { useAppSelector } from '../store/hooks';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  BusinessCenter,
  Schedule,
  History,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const sections = [
    {
      title: 'Informations personnelles',
      items: [
        {
          icon: <Person />,
          label: 'Nom complet',
          value: `${user?.firstName} ${user?.lastName}`,
        },
        { icon: <Email />, label: 'Email', value: user?.email },
        {
          icon: <BusinessCenter />,
          label: 'Rôle',
          value: user?.role === 'admin' ? 'Administrateur' : 'Collaborateur',
        },
      ],
    },
    {
      title: 'Accès',
      items: [
        {
          icon: <Schedule />,
          label: 'Date de début',
          value: formatDate(user?.startDate),
        },
        {
          icon: <Schedule />,
          label: 'Date de fin',
          value: user?.endDate
            ? formatDate(user?.endDate)
            : 'Pas de date de fin prévue',
        },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Profil utilisateur
      </Typography>

      <Grid container spacing={3}>
        {/* Section principale */}
        <Grid item xs={12} md={8}>
          {sections.map((section, idx) => (
            <Card key={idx} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {section.items.map((item, i) => (
                    <Grid item xs={12} key={i}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography>{item.value}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activité récente
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <History sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>Dernières actions</Typography>
              </Box>

              <Box sx={{ pl: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Modification du produit XX
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Création de la marque YY
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Ajout de caractéristiques
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
