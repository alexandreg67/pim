import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useTagsQuery } from '../../../generated/graphql-types';

type Tag = {
  id: string;
  name: string;
};

type TagsSectionProps = {
  productTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

const TagsSection = ({ productTags, onChange }: TagsSectionProps) => {
  const { loading, error, data: tagsData } = useTagsQuery();

  const [, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (tagsData?.tags) {
      setSelectedTags(tagsData.tags);
    }
  }, [tagsData]);

  if (error) {
    return (
      <Typography color="error">Erreur de chargement des catégories</Typography>
    );
  }

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Tags
      </Typography>
      <Autocomplete
        multiple
        options={tagsData?.tags || []}
        value={productTags}
        loading={loading}
        getOptionLabel={(option: Tag) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Sélectionner des tags"
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

export default TagsSection;
