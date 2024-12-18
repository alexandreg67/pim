import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from '../generated/graphql-types';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import ProductImages from '../components/products/ProductImages';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetProductQuery({
    variables: { productId: id || '' },
  });

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Erreur : {error.message}</Typography>;

  const product = data?.product;
  if (!product) return <Typography>Produit non trouvé</Typography>;

  const {
    name,
    description,
    shortDescription,
    price,
    brand,
    contact,
    categories,
    tags,
    images,
    productCharacteristics,
  } = product;

  const drawerWidth = 240;

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={4}>
        {/* Colonne gauche : Image principale */}
        <Grid item xs={12} md={6}>
          <ProductImages
            images={images.map((image) => ({
              ...image,
              altText: image.altText || 'Image du produit',
            }))}
          />
        </Grid>

        {/* Colonne droite : Informations produit */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            {price} €
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {shortDescription || 'Aucune description courte disponible.'}
          </Typography>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Marque :</strong> {brand?.name || 'Non spécifiée'}
            </Typography>
            {contact && (
              <Typography variant="body1">
                <strong>Contact :</strong> {contact.email}, {contact.phone},{' '}
                {contact.country}
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Catégories :</strong>{' '}
              {categories && categories.length > 0
                ? categories.map((cat) => cat.name).join(', ')
                : 'Non spécifiées'}
            </Typography>
            <Typography variant="body1">
              <strong>Tags :</strong>{' '}
              {tags && tags.length > 0
                ? tags.map((tag) => tag.name).join(', ')
                : 'Aucun'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Section Description */}
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>

      {/* Caractéristiques du produit */}
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Caractéristiques
        </Typography>
        {productCharacteristics && productCharacteristics.length > 0 ? (
          <Grid container spacing={2}>
            {productCharacteristics.map((char) => (
              <Grid item xs={12} sm={6} key={char.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {char.characteristic.name}
                    </Typography>
                    <Typography variant="body2">{char.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Aucune caractéristique disponible</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetailsPage;
