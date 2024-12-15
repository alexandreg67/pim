import React, { useState, useEffect } from 'react';
import { Box, Grid, Pagination, TextField } from '@mui/material';
import { useGetBrandsQuery } from '../../generated/graphql-types';
import BrandCard from './BrandCard';

const BrandList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, loading, error } = useGetBrandsQuery({
    variables: {
      limit: itemsPerPage,
      page: currentPage,
      search: debouncedSearchQuery,
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
            color: 'grey.500',
            opacity: 1,
          },
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'grey.500',
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
      <Grid container spacing={3}>
        {data?.brands.map((brand) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <BrandCard
              id={brand.id}
              name={brand.name}
              logo={brand.logo ?? ''}
              description={brand.description ?? ''}
              totalProducts={brand.totalProducts}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil((data?.totalBrands || 0) / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default BrandList;
