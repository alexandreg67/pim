import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Card,
  Chip,
  Tooltip,
  IconButton,
  Autocomplete,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  useGetBrandCountriesQuery,
  useGetBrandQuery,
} from '../generated/graphql-types';

const BrandDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  const { data: countriesData } = useGetBrandCountriesQuery({
    variables: { brandId: id || '' },
    skip: !id,
  });

  const { data, loading, error, refetch } = useGetBrandQuery({
    variables: {
      brandId: id || '',
      contactLimit: rowsPerPage,
      contactOffset: page * rowsPerPage,
      countryFilter: countryFilter || undefined,
    },
    skip: !id,
  });

  const brand = data?.brand;

  if (!id) {
    return (
      <Typography color="error">Error: ID is missing from the URL.</Typography>
    );
  }

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    refetch();
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    refetch();
  };

  const handleCountryFilterChange = (
    _: React.ChangeEvent<unknown>,
    newValue: string | null
  ) => {
    setCountryFilter(newValue);
    setPage(0);
    refetch();
  };

  const clearFilter = () => {
    setCountryFilter(null);
    setPage(0);
    refetch();
  };

  const getProductCountColor = (count: number) => {
    if (count === 0) return 'default';
    if (count < 6) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ mb: 4, p: 3, boxShadow: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          {/* Colonne gauche : Informations textuelles */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {brand?.name}
            </Typography>
            <Typography variant="body1">{brand?.description}</Typography>
          </Box>

          {/* Colonne droite : Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px',
              height: '100px',
            }}
          >
            <img
              src={
                brand?.logo
                  ? `http://localhost:8000/logos/${brand.logo}`
                  : '/api/placeholder/200/200'
              }
              alt={brand?.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Card>

      {/* Section Contacts avec Filtre */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Contacts
          {countryFilter && (
            <Chip
              label={`Filtré: ${countryFilter}`}
              size="small"
              onDelete={clearFilter}
              sx={{ ml: 2 }}
            />
          )}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Autocomplete
            sx={{ width: 300 }}
            options={countriesData?.brandCountries || []}
            value={countryFilter}
            onChange={handleCountryFilterChange}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Filtrer par pays"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <FilterIcon fontSize="small" color="action" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  sx: {
                    '& .MuiAutocomplete-input': {
                      color: 'text.primary',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                  },
                }}
              />
            )}
          />

          {countryFilter && (
            <Tooltip title="Effacer le filtre">
              <IconButton onClick={clearFilter} size="small">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Table des contacts */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell align="center">Produits associés</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brand?.contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.country}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={contact.totalProducts}
                    color={getProductCountColor(contact.totalProducts)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data?.brand?.totalContacts || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default BrandDetailsPage;
