import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface BrandCardProps {
  name: string;
  logo?: string;
  description?: string;
  productsCount: number;
}

const BrandCard: React.FC<BrandCardProps> = ({
  name,
  logo,
  description,
  productsCount,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={
          `http://localhost:8000/logos/${logo}` || '/api/placeholder/180/120'
        }
        alt={`${name} logo`}
        sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.50' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography>{logo}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`${productsCount} produits`}
            size="small"
            color="primary"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
