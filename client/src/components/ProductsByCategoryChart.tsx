import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProductsByCategoryChartProps {
  data: { categoryOrBrand: string; count: number }[];
}

const COLORS = ['#3f51b5', '#2196f3', '#f44336', '#4caf50'];

const ProductsByCategoryChart: React.FC<ProductsByCategoryChartProps> = ({
  data,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Produits par catégorie
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="categoryOrBrand"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={(entry) => entry.categoryOrBrand}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProductsByCategoryChart;
