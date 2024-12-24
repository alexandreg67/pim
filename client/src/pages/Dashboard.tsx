import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import ProductsByBrandChart from '../components/dashboard/ProductsByBrandChart';
import RecentHistory from '../components/dashboard/RecentHistory';
import { useDashboardStatsQuery } from '../generated/graphql-types';
import CategoryGridStats from '../components/dashboard/CategoryGridStats';

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
      user: {
        firstName: entry.user?.firstName || '',
        lastName: entry.user?.lastName || '',
      },
      product: {
        name: entry.product?.name || '',
        reference: entry.product?.reference || '',
      },
      action: {
        name: entry.action.name,
        description: entry.action.description || 'Aucune description',
        type: entry.action.type,
      },
      createdAt: entry.createdAt,
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
        <Grid item xs={12}>
          <CategoryGridStats data={productsByCategoryData} />
        </Grid>
        <Grid item xs={12}>
          <ProductsByBrandChart data={productsByBrandData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
