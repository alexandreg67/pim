import React from 'react';
import ProductList from '../components/products/ProductList';
import { Box, Grid, Typography } from '@mui/material';

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
        <ProductList />
      </Grid>
    </Box>
  );
};

export default ProductsPage;
