import React from 'react';
import BrandList from '../components/brands/BrandList';
import { Box, Typography } from '@mui/material';

const drawerWidth = 240;

const BrandsPage: React.FC = () => {
  return (
    <Box
      sx={{
        marginLeft: { sm: `${drawerWidth}px` },
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Liste des marques
      </Typography>
      <BrandList />
    </Box>
  );
};

export default BrandsPage;
