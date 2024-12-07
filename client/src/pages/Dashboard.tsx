import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StatCard from '../components/StatCard';
import ProductsByBrandChart from '../components/ProductsByBrandChart';
import ProductsByCategoryChart from '../components/ProductsByCategoryChart';
import RecentHistory from '../components/RecentHistory';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const data = {
    totalProducts: 10000,
    productsByBrand: [
      { categoryOrBrand: 'Dell', count: 840 },
      { categoryOrBrand: 'HP', count: 1622 },
      { categoryOrBrand: 'Apple', count: 2527 },
      { categoryOrBrand: 'Canon', count: 1645 },
      { categoryOrBrand: 'Samsung', count: 2533 },
      { categoryOrBrand: 'Seagate', count: 833 },
    ],
    productsByCategory: [{ categoryOrBrand: 'Pas de catégorie', count: 10000 }],
    recentHistory: [
      { action: 'Produit ajouté', createdAt: '2023-12-05T14:30:00Z' },
      { action: 'Produit supprimé', createdAt: '2023-12-05T13:00:00Z' },
    ],
    pendingCommunications: 5,
  };

  return (
    <Box
      sx={{
        marginLeft: { sm: `${drawerWidth}px` },
        padding: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Produits" value={data.totalProducts} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <ProductsByBrandChart data={data.productsByBrand} />
        </Grid>
        <Grid item xs={12}>
          <ProductsByCategoryChart data={data.productsByCategory} />
        </Grid>
        <Grid item xs={12}>
          <RecentHistory history={data.recentHistory} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
