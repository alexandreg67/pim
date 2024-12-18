import React from 'react';
import ProductList from '../components/products/ProductList';
import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterContainer } from '../components/products/filters/FilterContainer';
import { FilterState } from '../components/products/filters/types';

const ProductsPage: React.FC = () => {
  const drawerWidth = 240;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || ''; // Récupère le paramètre "query" depuis l'URL
  const navigate = useNavigate();

  const handleResetSearch = () => {
    queryParams.delete('query'); // Supprime le paramètre "query" de l'URL
    navigate({
      pathname: '/products', // Navigue vers /products sans paramètres
      search: queryParams.toString(),
    });
  };

  const handleFiltersChange = (filters: FilterState) => {
    console.info('Nouveaux filtres:', filters);
  };

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 3 }}>
      {searchQuery ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Résultats pour : {searchQuery}</Typography>
          <Button
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '20px',
              backgroundColor: 'primary.main',
              color: 'white',
              ':hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={handleResetSearch}
          >
            Réinitialiser la recherche
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Tous les produits</Typography>
        </Box>
      )}
      <FilterContainer
        onFilterChange={handleFiltersChange}
        initialFilters={{
          searchQuery: searchQuery || undefined,
          status: '',
          brandIds: [],
        }}
      />
      <ProductList searchQuery={searchQuery || undefined} />
    </Box>
  );
};

export default ProductsPage;
