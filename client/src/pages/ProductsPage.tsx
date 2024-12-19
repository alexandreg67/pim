import React from 'react';
import ProductList from '../components/products/ProductList';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { FilterContainer } from '../components/products/filters/FilterContainer';
import { FilterState } from '../components/products/filters/types';

const ProductsPage: React.FC = () => {
  const drawerWidth = 240;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';

  const handleFiltersChange = (filters: FilterState) => {
    console.info('Nouveaux filtres:', filters);
  };

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4">Tous les produits</Typography>
      </Box>

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
