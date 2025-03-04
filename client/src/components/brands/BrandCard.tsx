import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../../utils/assets';

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
      onClick={() => navigate(`/brands/${id}`)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={logo ? getAssetUrl(logo, 'logos') : '/api/placeholder/180/120'}
        alt={`${name} logo`}
        sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.50' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
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
