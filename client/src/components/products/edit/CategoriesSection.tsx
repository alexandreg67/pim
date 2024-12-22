import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useCategoriesQuery } from '../../../generated/graphql-types';

type Category = {
  id: string;
  name: string;
};

type CategoriesSectionProps = {
  productCategories: Category[];
  onChange: (categories: Category[]) => void;
};

const CategoriesSection = ({
  productCategories,
  onChange,
}: CategoriesSectionProps) => {
  const { loading, error, data: categoryData } = useCategoriesQuery();

  const [, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categoryData?.categories) {
      setSelectedCategories(categoryData.categories);
    }
  }, [categoryData]);

  if (error) {
    return (
      <Typography color="error">Erreur de chargement des catégories</Typography>
    );
  }

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Catégories
      </Typography>
      <Autocomplete
        multiple
        options={categoryData?.categories || []}
        value={productCategories}
        loading={loading}
        getOptionLabel={(option: Category) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Sélectionner des catégories"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Grid>
  );
};

export default CategoriesSection;
