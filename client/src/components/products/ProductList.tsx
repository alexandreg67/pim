import React, { useState } from 'react';
import { Box, Divider, Grid, Pagination, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from '../../generated/graphql-types';
import ProductResultsSummary from './ProductResultsSummary';
import { ProductStatus } from '../../types/enum/product';
import { getStatusLabel } from '../../utils/product.utils';

interface ProductListProps {
  searchQuery?: string; // Recherche optionnelle
  status?: string; // Filtre optionnel
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery, status }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, loading, error } = useGetProductsQuery({
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      query: searchQuery,
      status: status,
    },
  });

  // Gestion de la pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const products = data?.products?.items || [];
  const totalProducts = data?.products?.total || 0;
  if (loading) return <Typography>Chargement...</Typography>;
  if (error)
    return <Typography color="error">Erreur : {error.message}</Typography>;

  return (
    <Box>
      <ProductResultsSummary
        total={totalProducts}
        searchQuery={searchQuery}
        status={status}
      />
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
            <ProductCard
              id={product.id}
              name={product.name}
              brand={product.brand?.name || 'Aucune marque'}
              price={parseFloat(product.price)}
              reference={product.reference}
              status={getStatusLabel(product.status as ProductStatus)}
              categories={product.categories.map((category) => category.name)}
              tags={product.tags.map((tag) => tag.name)}
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
