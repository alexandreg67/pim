import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProductsByBrandChartProps {
  data: { categoryOrBrand: string; count: number }[];
}

const ProductsByBrandChart: React.FC<ProductsByBrandChartProps> = ({
  data,
}) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Produits par marque
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="categoryOrBrand" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProductsByBrandChart;
