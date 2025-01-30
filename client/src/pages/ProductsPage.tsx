import React, { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductTableView from '../components/products/ProductTableView';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import { ViewList, GridView } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { FilterContainer } from '../components/products/filters/FilterContainer';
import { FilterState } from '../components/products/filters/types';

type ViewMode = 'cards' | 'table';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const handleFiltersChange = (filters: FilterState) => {
    setSelectedStatus(filters.status);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4">Tous les produits</Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newView) => newView && setViewMode(newView)}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="cards" aria-label="cards view">
            <Tooltip title="Vue cards">
              <GridView />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <Tooltip title="Vue tableau">
              <ViewList />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <FilterContainer
        onFilterChange={handleFiltersChange}
        initialFilters={{
          searchQuery: searchQuery || undefined,
          status: '',
          brandIds: [],
        }}
      />

      {viewMode === 'cards' ? (
        <ProductList
          searchQuery={searchQuery || undefined}
          status={selectedStatus || undefined}
        />
      ) : (
        <ProductTableView
          searchQuery={searchQuery || undefined}
          status={selectedStatus || undefined}
        />
      )}
    </Box>
  );
};

export default ProductsPage;
