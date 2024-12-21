import { FC } from 'react';
import { FormControl, Select, MenuItem, Chip, Box } from '@mui/material';
import { ProductStatus } from '../../../types/enum/product';
import { statusConfig } from '../../../config/status.config';

interface StatusFilterProps {
  value: ProductStatus | '';
  onChange: (status: ProductStatus | '') => void;
}

export const StatusFilter: FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 200,
        borderColor: 'grey.500',
        borderRadius: '8px',
        boxShadow: 2,
      }}
    >
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductStatus)}
        displayEmpty
        renderValue={(selected) =>
          selected ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                minHeight: '40px',
                alignItems: 'center',
              }}
            >
              <Chip
                size="small"
                label={statusConfig[selected as ProductStatus]?.label}
                color={statusConfig[selected as ProductStatus]?.color}
                sx={{ height: '30px', marginTop: '2px' }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '40px',
              }}
            >
              <span style={{ color: 'gray', opacity: 0.5 }}>Statut</span>
            </Box>
          )
        }
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
