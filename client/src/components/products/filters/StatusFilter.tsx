import { FC } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { ProductStatus, statusConfig } from './types';

interface StatusFilterProps {
  value: ProductStatus | '';
  onChange: (status: ProductStatus | '') => void;
}

export const StatusFilter: FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Statut</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductStatus)}
        label="Statut"
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected && (
              <Chip
                size="small"
                label={statusConfig[selected as ProductStatus]?.label}
                color={statusConfig[selected as ProductStatus]?.color}
                sx={{ height: '30px', marginTop: '2px' }}
              />
            )}
          </Box>
        )}
        sx={{ color: 'text.primary' }}
      >
        <MenuItem value="">
          <em>Tous</em>
        </MenuItem>
        {Object.entries(ProductStatus).map(([key, value]) => (
          <MenuItem key={key} value={value}>
            <Chip
              size="small"
              label={statusConfig[value].label}
              color={statusConfig[value].color}
              sx={{ height: '24px' }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
