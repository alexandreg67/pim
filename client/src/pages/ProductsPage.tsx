import React from 'react';
import ProductList from '../components/products/ProductList';
import { Box, Grid, Typography } from '@mui/material';

export const mockProducts = [
  { id: '1', name: 'Produit 1', brand: 'Marque A', price: 50, stock: 10 },
  { id: '2', name: 'Produit 2', brand: 'Marque B', price: 70, stock: 0 },
  { id: '3', name: 'Produit 3', brand: 'Marque C', price: 30, stock: 5 },
  { id: '4', name: 'Produit 4', brand: 'Marque A', price: 20, stock: 2 },
  { id: '5', name: 'Produit 5', brand: 'Marque D', price: 60, stock: 8 },
  { id: '6', name: 'Produit 6', brand: 'Marque B', price: 100, stock: 1 },
  { id: '7', name: 'Produit 7', brand: 'Marque E', price: 40, stock: 3 },
];

const ProductsPage: React.FC = () => {
  const drawerWidth = 240;
  return (
    <Box
      sx={{
        marginLeft: { sm: `${drawerWidth}px` },
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Liste des produits
      </Typography>
      <Grid container spacing={2}>
        <ProductList products={mockProducts} />
      </Grid>
    </Box>
  );
};

export default ProductsPage;
