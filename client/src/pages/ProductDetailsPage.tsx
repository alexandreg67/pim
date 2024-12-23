import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductQuery } from '../generated/graphql-types';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from '@mui/material';
import ProductImages from '../components/products/ProductImages';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { getStatusLabel } from '../utils/product.utils';
import { ArrowBack, Edit } from '@mui/icons-material';

const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate(`/products/`)}
        >
          Retour
        </Button>
        <Typography variant="h3" gutterBottom>
          {name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/products/${id}/edit`)}
          className="bg-blue-600"
        >
          Modifier
        </Button>
      </Box>

      {/* Section Images */}
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
            <Typography variant="body1">
              <strong>Reference :</strong> {product.reference}
            </Typography>
            {contact && (
              <>
                <Typography variant="body1">
                  <strong>Contact :</strong>
                </Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}
                >
                  <EmailIcon opacity="0.5" />
                  <Typography variant="body1">{contact.email}</Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}
                >
                  <PhoneIcon opacity="0.5" />
                  <Typography variant="body1">{contact.phone}</Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}
                >
                  <PublicIcon opacity="0.5" />
                  <Typography variant="body1">{contact.country}</Typography>
                </Box>
              </>
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
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Status :</strong> {getStatusLabel(product.status)}
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
