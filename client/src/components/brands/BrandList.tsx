import React, { useState } from 'react';
import { Box, Grid, Pagination, TextField } from '@mui/material';
import BrandCard from './BrandCard';

// Données mockées
const mockBrands = [
  {
    id: '1',
    name: 'Dell',
    logo: undefined,
    country: 'USA',
    productsCount: 245,
    contactEmail: 'contact@dell.com',
  },
  {
    id: '2',
    name: 'HP',
    logo: undefined,
    country: 'USA',
    productsCount: 189,
    contactEmail: 'contact@hp.com',
  },
  {
    id: '3',
    name: 'Apple',
    logo: undefined,
    country: 'USA',
    productsCount: 156,
    contactEmail: 'contact@apple.com',
  },
  {
    id: '4',
    name: 'Samsung',
    logo: undefined,
    country: 'Corée du Sud',
    productsCount: 324,
    contactEmail: 'contact@samsung.com',
  },
  {
    id: '5',
    name: 'Seagate',
    logo: undefined,
    country: 'USA',
    productsCount: 89,
    contactEmail: 'contact@seagate.com',
  },
  {
    id: '6',
    name: 'Canon',
    logo: undefined,
    country: 'Japon',
    productsCount: 167,
    contactEmail: 'contact@canon.com',
  },
];

const BrandList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredBrands = mockBrands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher une marque..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3}>
        {paginatedBrands.map((brand) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <BrandCard
              name={brand.name}
              logo={brand.logo}
              country={brand.country}
              productsCount={brand.productsCount}
              contactEmail={brand.contactEmail}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredBrands.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default BrandList;
