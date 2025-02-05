import { useEffect, useState, useMemo } from 'react';
import {
  Grid,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material';
import { Email, Phone, Public } from '@mui/icons-material';
import {
  useGetBrandQuery,
  useGetBrandCountriesQuery,
} from '../../../generated/graphql-types';
import debounce from 'lodash/debounce';
import { Contact } from '../../../types/contact.types';

type ContactSectionProps = {
  brandId: string;
  selectedContact: Contact | null;
  onChange: (contact: Contact | null) => void;
};

const ContactSection = ({
  brandId,
  selectedContact,
  onChange,
}: ContactSectionProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { data: countriesData } = useGetBrandCountriesQuery({
    variables: { brandId },
    skip: !brandId,
  });

  const { loading, data: brandData } = useGetBrandQuery({
    variables: {
      brandId,
      countryFilter: selectedCountry,
      contactLimit: 500,
    },
    skip: !brandId,
  });

  const countries = countriesData?.brandCountries || [];

  const contacts = useMemo(
    () => brandData?.brand?.contacts || [],
    [brandData?.brand?.contacts]
  );

  // Filtrage des contacts en fonction de la recherche
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;

    const searchLower = searchQuery.toLowerCase();
    return contacts.filter((contact) => {
      return (
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.phone?.includes(searchQuery) ||
        contact.country?.toLowerCase().includes(searchLower)
      );
    });
  }, [contacts, searchQuery]);

  // Debounce la recherche pour éviter trop de re-renders
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Contact pour ce produit
        </Typography>
        {!brandId ? (
          <Typography color="error">
            Veuillez d&apos;abord sélectionner une marque
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {contacts.length} contacts disponibles
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Filtrer par pays</InputLabel>
          <Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            label="Filtrer par pays"
            disabled={!brandId}
          >
            <MenuItem value="">Tous les pays ({contacts.length})</MenuItem>
            {countries.map((country) => {
              const count = contacts.filter(
                (c) => c.country === country
              ).length;
              return (
                <MenuItem key={country} value={country}>
                  {country} ({count})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          disabled={!brandId}
          options={filteredContacts}
          value={selectedContact}
          loading={loading}
          inputValue={inputValue}
          onInputChange={(_, newValue) => {
            setInputValue(newValue);
            debouncedSearch(newValue);
          }}
          getOptionLabel={(option) => option.email || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, newValue) => onChange(newValue)}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props; // Extraire la key du reste des props
            return (
              <li {...otherProps} key={key}>
                <Box sx={{ width: '100%' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Email fontSize="small" color="action" />
                    <Typography>{option.email || 'No email'}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Public fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        {option.country || 'No country'}
                      </Typography>
                    </Box>
                    {option.phone && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {option.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </li>
            );
          }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.id}
                label={option.email}
                size="small"
              />
            ))
          }
          renderInput={(params) => {
            const props = {
              ...params,
              label: 'Contact',
              required: true,
              placeholder: 'Sélectionner un contact',
              InputProps: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            };
            return <TextField {...props} />;
          }}
        />
      </Grid>

      {filteredContacts.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            {filteredContacts.length === 0 && searchQuery && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  Aucun contact ne correspond à votre recherche
                </Typography>
              </Grid>
            )}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ContactSection;
