import { Box, Typography } from '@mui/material';
import { getStatusLabel } from '../../utils/product.utils';

interface ProductResultsSummaryProps {
  total: number;
  searchQuery?: string;
  status?: string;
}

const ProductResultsSummary = ({
  total,
  searchQuery,
  status,
}: ProductResultsSummaryProps) => {
  const getFilterDescription = () => {
    const filters = [];
    if (searchQuery) filters.push(`"${searchQuery}"`);
    if (status) {
      // Convertir le status technique en libellé français
      const statusLabel = getStatusLabel(status);
      filters.push(`statut "${statusLabel}"`);
    }

    if (filters.length === 0) return '';
    return `pour ${filters.join(' et ')}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'lg',
        mx: 'auto',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: 'text.primary',
            fontWeight: total > 0 ? 'medium' : 'regular',
          }}
        >
          {total > 0 ? (
            <>
              {total.toLocaleString()}{' '}
              {total === 1 ? 'produit trouvé' : 'produits trouvés'}
            </>
          ) : (
            'Aucun produit trouvé'
          )}
        </Typography>

        {(searchQuery || status) && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {getFilterDescription()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductResultsSummary;
