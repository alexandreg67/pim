// components/products/filters/BrandFilter.tsx
import { FC } from 'react';

import { Autocomplete, TextField } from '@mui/material';
import { useGetBrandsForFilterQuery } from '../../../generated/graphql-types';

interface BrandFilterProps {
  selectedBrands: string[];
  onChange: (selectedBrands: string[]) => void;
}

export const BrandFilter: FC<BrandFilterProps> = ({
  selectedBrands,
  onChange,
}) => {
  const { data } = useGetBrandsForFilterQuery();

  const selectedBrandObjects = (data?.brandsForFilter || []).filter((brand) =>
    selectedBrands.includes(brand.id)
  );

  return (
    <Autocomplete
      multiple
      value={selectedBrandObjects}
      onChange={(_, newValue) => {
        onChange(newValue.map((brand) => brand.id));
      }}
      options={data?.brandsForFilter || []}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          // label="Marques"
          size="small"
          placeholder={'Sélectionner une ou plusieurs marques'}
        />
      )}
      noOptionsText="Aucune marque trouvée"
      sx={{
        display: 'flex',
        alignItems: 'center',
        boxShadow: 1,
        minWidth: 340,
        outline: 'none',
      }}
    />
  );
};
