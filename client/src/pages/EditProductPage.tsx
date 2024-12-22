import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack, Delete, CloudUpload } from '@mui/icons-material';
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from '../generated/graphql-types';
import { useNavigate, useParams } from 'react-router-dom';
import CategoriesSection from '../components/products/edit/CategoriesSection';
import { useNotification } from '../hooks/useNotification';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      sx={{ p: 4 }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const { success, error: showError } = useNotification();
  const [productCategories, setProductCategories] = useState<
    { __typename?: 'Categories'; id: string; name: string }[]
  >([]);

  const {
    data: productData,
    loading: productLoading,
    refetch,
  } = useGetProductQuery({
    variables: { productId: id || '' },
  });
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (productData?.product?.categories) {
      setProductCategories(productData.product.categories);
    }
  }, [productData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSave = async () => {
    try {
      await updateProduct({
        variables: {
          id: id as string,
          input: {
            categoryIds: productCategories.map((cat) => cat.id),
          },
        },
      });
      success('Produit mis à jour avec succès');
      await refetch();
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de la mise à jour du produit');
    }
  };

  if (productLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!productData?.product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Produit non trouvé</Typography>
      </Box>
    );
  }

  const drawerWidth = 240;

  return (
    <Box sx={{ marginLeft: { sm: `${drawerWidth}px` }, p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate(`/products/${id}`)}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          color="primary"
          onClick={() => handleSave()}
        >
          Enregistrer
        </Button>
      </Box>

      {/* Main content */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Informations générales" />
          <Tab label="Catégories & Tags" />
          <Tab label="Images" />
          <Tab label="Caractéristiques" />
        </Tabs>

        {/* Informations générales */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Référence" disabled sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nom" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description courte"
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={4} />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Catégories & Tags */}
        <TabPanel value={currentTab} index={1}>
          <Grid container spacing={3}>
            <CategoriesSection
              productCategories={productCategories}
              onChange={setProductCategories}
            />
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Autocomplete
                multiple
                options={[]}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Sélectionner des tags" />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Images */}
        <TabPanel value={currentTab} index={2}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 1,
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
                color="primary"
              >
                Ajouter des images
                <input type="file" multiple hidden accept="image/*" />
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image="/api/placeholder/400/200"
                    alt="Image preview"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Image principale
                    </Typography>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </TabPanel>

        {/* Caractéristiques */}
        <TabPanel value={currentTab} index={3}>
          <Alert severity="info" sx={{ mb: 4 }}>
            Vous pourrez ajouter des caractéristiques une fois le produit créé
          </Alert>
          <Grid container spacing={2}>
            {/* Liste des caractéristiques à implémenter */}
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default EditProductPage;
