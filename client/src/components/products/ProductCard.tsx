import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  stock: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  price,
  stock,
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
        <Typography variant="body2" color={stock > 0 ? 'green' : 'red'}>
          Stock: {stock > 0 ? 'En stock' : 'Rupture de stock'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
