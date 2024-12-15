import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BrandCardProps {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  totalProducts: number;
}

const BrandCard: React.FC<BrandCardProps> = ({
  id,
  name,
  logo,
  description,
  totalProducts,
}) => {
  const navigate = useNavigate();
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
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/brands/${id}`)}
        >
          Voir les détails
        </Button>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`${totalProducts} produits`}
            size="small"
            color="primary"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
