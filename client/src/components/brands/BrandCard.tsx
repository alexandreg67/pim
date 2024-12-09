import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface BrandCardProps {
  name: string;
  logo?: string;
  country: string;
  productsCount: number;
  contactEmail: string;
}

const BrandCard: React.FC<BrandCardProps> = ({
  name,
  logo,
  country,
  productsCount,
  contactEmail,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={logo || '/api/placeholder/200/140'}
        alt={`${name} logo`}
        sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.50' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip label={country} size="small" sx={{ mr: 1 }} />
          <Chip
            label={`${productsCount} produits`}
            size="small"
            color="primary"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Contact: {contactEmail}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
