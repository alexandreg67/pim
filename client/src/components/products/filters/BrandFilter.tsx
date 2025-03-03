import { FC } from 'react';
import { FormControl, Select, MenuItem, Box } from '@mui/material';
import { useGetBrandsForFilterQuery } from '../../../generated/graphql-types';

interface BrandFilterProps {
  value: string | '';
  onChange: (value: string | '') => void;
}

export const BrandFilter: FC<BrandFilterProps> = ({ value, onChange }) => {
  const { data } = useGetBrandsForFilterQuery();
  const brands = data?.brandsForFilter || [];

  return (
    <FormControl size="small" sx={{ minWidth: 200, borderRadius: '8px' }}>
      <Select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as string);
        }}
        displayEmpty
        renderValue={(selected) =>
          selected ? (
            <Box
              sx={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}
            >
              {brands.find((brand) => brand.id === selected)?.name || 'Marque'}
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}
            >
              <span style={{ color: 'gray', opacity: 0.5 }}>Marque</span>
            </Box>
          )
        }
      >
        <MenuItem value="">
          <em>Toutes</em>
        </MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.id}>
            {brand.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
