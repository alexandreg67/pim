import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  status: string;
  reference: string;
  categories: string[];
  tags: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  status,
  reference,
  categories,
  tags,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  return (
    <Card
      sx={{
        minWidth: 275,
        maxWidth: 300,
        margin: 2,
        boxShadow: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body1">Reference : {reference}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Marque : {brand}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Prix : {price} €
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Catégories : {categories.join(', ')}
        </Typography>
        <Typography variant="body2">Tags : {tags.join(', ')}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          Status : {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
