import React from 'react';
import ProductList from '../components/products/ProductList';
import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const drawerWidth = 240;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || ''; // Récupère le paramètre "query" depuis l'URL
  const navigate = useNavigate();

  const handleResetSearch = () => {
    queryParams.delete('query'); // Supprime le paramètre "query" de l'URL
    navigate({
      pathname: '/products', // Navigue vers /products sans paramètres
      search: queryParams.toString(),
    });
  };

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 3 }}>
      {searchQuery ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Résultats pour : {searchQuery}</Typography>
          <Button
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '20px',
              backgroundColor: 'primary.main',
              color: 'white',
              ':hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={handleResetSearch}
          >
            Réinitialiser la recherche
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4">Tous les produits</Typography>
        </Box>
      )}
      <ProductList searchQuery={searchQuery || undefined} />
    </Box>
  );
};

export default ProductsPage;
