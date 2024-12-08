import React, { useState } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from '../../generated/graphql-types';

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Correspond au "limit" pour l'API

  // Récupération des produits via le hook GraphQL
  const { data, loading, error } = useGetProductsQuery({
    variables: { page: currentPage, limit: itemsPerPage },
  });

  // Gestion des erreurs ou du chargement
  if (loading) return <Typography>Chargement...</Typography>;
  if (error)
    return <Typography color="error">Erreur : {error.message}</Typography>;

  const products = data?.products || [];
  const totalProducts = data?.dashboardStats.totalProducts || 0;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
            <ProductCard
              name={product.name}
              brand={product.brand?.name || 'Aucune marque'}
              price={product.price}
              status={product.status || 'Inconnu'}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={Math.ceil(totalProducts / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductList;
