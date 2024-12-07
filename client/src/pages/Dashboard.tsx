import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StatCard from '../components/StatCard';
import ProductsByBrandChart from '../components/ProductsByBrandChart';
import ProductsByCategoryChart from '../components/ProductsByCategoryChart';
import RecentHistory from '../components/RecentHistory';
import { useDashboardStatsQuery } from '../generated/graphql-types';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboardStatsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const productsByCategoryData = (
    data?.dashboardStats.productsByCategory || []
  ).map((category) => ({
    categoryOrBrand: category.categoryOrBrand || 'Unknown',
    count: category.count,
  }));

  const recentHistoryData = (data?.dashboardStats.recentHistory || []).map(
    (entry) => ({
      action: entry.action,
      createdAt: entry.createdAt.toISOString(),
    })
  );

  const productsByBrandData = (data?.dashboardStats.productsByBrand || []).map(
    (el) => ({
      categoryOrBrand: el.categoryOrBrand || 'Unknown',
      count: el.count,
    })
  );
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
          <StatCard
            title="Total Produits"
            value={data?.dashboardStats.totalProducts || 0}
          />
        </Grid>
        <Grid item xs={12}>
          <RecentHistory history={recentHistoryData} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <ProductsByCategoryChart data={productsByCategoryData} />
        </Grid>
        <Grid item xs={12}>
          <ProductsByBrandChart data={productsByBrandData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
