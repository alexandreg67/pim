import React, { useState } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
} from '../../generated/graphql-types';

interface ProductListProps {
  searchQuery?: string; // Recherche optionnelle
}

const ProductList: React.FC<ProductListProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Requête pour la recherche
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useSearchProductsQuery({
    variables: {
      query: searchQuery || '', // Nécessaire même si `skip` est actif
      page: currentPage,
      limit: itemsPerPage,
    },
    skip: !searchQuery, // Désactive cette requête si aucun `searchQuery`
  });

  // Requête pour tous les produits
  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useGetProductsQuery({
    variables: {
      page: currentPage,
      limit: itemsPerPage,
    },
    skip: !!searchQuery, // Désactive cette requête si `searchQuery` est actif
  });

  // Centralisation des états
  const loading = searchQuery ? searchLoading : allLoading;
  const error = searchQuery ? searchError : allError;
  const products = searchQuery
    ? searchData?.searchProducts?.items || []
    : allData?.products?.items || [];
  const totalProducts = searchQuery
    ? searchData?.searchProducts?.total || 0
    : allData?.products?.total || 0;

  // Gestion de la pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Gestion des erreurs ou du chargement
  if (loading) return <Typography>Chargement...</Typography>;
  if (error)
    return <Typography color="error">Erreur : {error.message}</Typography>;

  return (
    <Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
            <ProductCard
              id={product.id}
              name={product.name}
              brand={product.brand?.name || 'Aucune marque'}
              price={parseFloat(product.price)}
              reference={product.reference}
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
