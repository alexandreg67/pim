import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  status: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  price,
  status,
}) => {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 300, margin: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Marque: {brand}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Prix: {price} €
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
