import { Box, Chip, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Adapter le type de `brandId` pour être une seule valeur `string | ''`
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get('query') || undefined,
    status: '',
    brandId: '',
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
  }, [filters.searchQuery, searchParams]);

  const handleFilterChange = (filterUpdate: Partial<FilterState>) => {
    const newFilters = {
      ...filters,
      ...filterUpdate,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetSearch = () => {
    searchParams.delete('query');
    navigate({
      pathname: '/products',
      search: searchParams.toString(),
    });
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
            value={filters.brandId}
            onChange={(brandId) => handleFilterChange({ brandId })}
          />
        </Box>

        {filters.searchQuery && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.primary">
              Recherche active :
            </Typography>
            <Chip
              label={filters.searchQuery}
              onDelete={() => handleResetSearch()}
              size="small"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};
