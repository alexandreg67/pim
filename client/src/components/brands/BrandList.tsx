import React, { useState, useEffect } from 'react';
import { Box, Grid, Pagination, TextField } from '@mui/material';
import { useGetBrandsQuery } from '../../generated/graphql-types';
import BrandCard from './BrandCard';

const BrandList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Débouncer la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Attente de 300ms après la dernière frappe
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, loading, error } = useGetBrandsQuery({
    variables: {
      limit: itemsPerPage,
      page: currentPage,
      search: debouncedSearchQuery, // Transmettre la requête de recherche
    },
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box>
      {/* Barre de recherche */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher une marque..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: 400,
          mb: 3,
          bgcolor: 'white',
          '& .MuiInputBase-input::placeholder': {
            color: 'grey.500', // Couleur du placeholder
            opacity: 1, // Assure que le placeholder est visible
          },
          borderRadius: 1, // Arrondi des bordures
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'grey.500', // Couleur de la bordure
            },
            '&:hover fieldset': {
              borderColor: 'black', // Couleur au survol
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main', // Couleur au focus
            },
          },
        }}
      />

      {/* Liste des marques */}
      <Grid container spacing={3}>
        {data?.brands.map((brand) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <BrandCard
              name={brand.name}
              logo={brand.logo ?? ''}
              description={brand.description ?? ''}
              productsCount={0}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil((data?.totalBrands || 0) / itemsPerPage)} // Nombre total de pages
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default BrandList;
