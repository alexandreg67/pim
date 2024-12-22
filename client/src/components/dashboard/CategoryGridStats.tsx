import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

interface CategoryData {
  categoryOrBrand: string;
  count: number;
}

interface CategoryGridStatsProps {
  data: CategoryData[];
}

const COLORS = [
  '#4361ee',
  '#3a0ca3',
  '#7209b7',
  '#f72585',
  '#4895ef',
  '#4cc9f0',
];

const CategoryGridStats: React.FC<CategoryGridStatsProps> = ({ data }) => {
  const theme = useTheme();
  const totalProducts = data.reduce((sum, item) => sum + item.count, 0);
  const percentages = data.map((item) => ({
    ...item,
    percentage: (item.count / totalProducts) * 100,
  }));
  const totalPercentage = percentages.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  const normalizedData = percentages.map((item) => ({
    ...item,
    percentage: (item.percentage / totalPercentage) * 100,
  }));

  const sortedData = normalizedData.sort((a, b) => b.percentage - a.percentage);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Distribution des Produits par Catégorie
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          width: '100%',
        }}
      >
        {sortedData.map((category, index) => {
          const percentage = Math.max(
            (category.count / totalProducts) * 100,
            0.1
          );
          const color = COLORS[index % COLORS.length];

          return (
            <Grid item xs={12} sm={6} md={3} key={category.categoryOrBrand}>
              <Card
                sx={{
                  border: 1,
                  borderColor: 'grey.200',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: color,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {category.categoryOrBrand}
                    </Typography>
                    <BarChartIcon
                      sx={{
                        color: color,
                        fontSize: 24,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: color,
                      }}
                    >
                      {category.count}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {percentage.toFixed(1)}% du total
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      width: '100%',
                      bgcolor: 'grey.100',
                      borderRadius: 5,
                      height: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${percentage}%`,
                        bgcolor: color,
                        height: '100%',
                        borderRadius: 5,
                        transition: 'width 1s ease-in-out',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CategoryGridStats;
