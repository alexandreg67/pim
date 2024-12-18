import { Box, Chip, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from './types';
import { StatusFilter } from './StatusFilter';
import { BrandFilter } from './BrandFilter';

interface FilterContainerProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get('query') || undefined,
    status: '',
    brandIds: [],
    ...initialFilters,
  });

  useEffect(() => {
    const query = searchParams.get('query');
    if (query !== filters.searchQuery) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: query || undefined,
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (filterUpdate: Partial<FilterState>) => {
    const newFilters = {
      ...filters,
      ...filterUpdate,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <StatusFilter
            value={filters.status}
            onChange={(status) => handleFilterChange({ status })}
          />
          <BrandFilter
            selectedBrands={filters.brandIds}
            onChange={(brandIds) => handleFilterChange({ brandIds })}
          />
        </Box>

        {filters.searchQuery && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.primary">
              Recherche active :
            </Typography>
            <Chip
              label={filters.searchQuery}
              onDelete={() => handleFilterChange({ searchQuery: undefined })}
              size="small"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};
