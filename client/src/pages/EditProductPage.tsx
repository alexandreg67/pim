import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Stack,
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
import TagsSection from '../components/products/edit/TagsSection';
import GeneralInfoSection from '../components/products/edit/GeneralInfoSection';
import { ProductStatus } from '../types/enum/product';
import { CharacteristicType } from '../types/Characteristic';
import CharacteristicsSection from '../components/products/edit/CharacteristicsSection';

type Brand = {
  id: string;
  name: string;
};

type GeneralInfo = {
  reference: string;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  status: ProductStatus;
  label?: string;
  brand: Brand;
};

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
  const [productCharacteristics, setProductCharacteristics] = useState<
    CharacteristicType[]
  >([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const { success, error: showError } = useNotification();
  const [productCategories, setProductCategories] = useState<
    { __typename?: 'Categories'; id: string; name: string }[]
  >([]);
  const [productTags, setProductTags] = useState<
    { __typename?: 'Tags'; id: string; name: string }[]
  >([]);
  const [productInfo, setProductInfo] = useState<GeneralInfo>({
    reference: '',
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    status: ProductStatus.DRAFT,
    brand: { id: '', name: '' },
  });

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
    if (productData?.product?.tags) {
      setProductTags(productData.product.tags);
    }
    if (productData?.product?.productCharacteristics) {
      setProductCharacteristics(productData.product.productCharacteristics);
    }
    setProductInfo({
      reference: productData?.product?.reference || '',
      name: productData?.product?.name || '',
      shortDescription: productData?.product?.shortDescription || '',
      description: productData?.product?.description || '',
      price: productData?.product?.price || '',
      status:
        (productData?.product?.status as ProductStatus) || ProductStatus.DRAFT,
      brand: {
        name: productData?.product?.brand?.name || '',
        id: '',
      },
    });
  }, [productData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSave = async () => {
    if (!productInfo.name) {
      return showError('Le nom du produit est requis');
    }
    try {
      await updateProduct({
        variables: {
          id: id as string,
          input: {
            categoryIds: productCategories.map((cat) => cat.id),
            tagIds: productTags.map((tag) => tag.id),
            name: productInfo.name,
            shortDescription: productInfo.shortDescription,
            description: productInfo.description,
            price: productInfo.price,
            status: productInfo.status as 'draft' | 'published',
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

  return (
    <Box sx={{ p: 4 }}>
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
            <GeneralInfoSection
              productInfo={productInfo}
              onChange={(infos: Partial<GeneralInfo>) =>
                setProductInfo((prevInfo) => ({ ...prevInfo, ...infos }))
              }
              mode="edit"
            />
          </Grid>
        </TabPanel>

        {/* Catégories & Tags */}
        <TabPanel value={currentTab} index={1}>
          <Grid container spacing={3}>
            <CategoriesSection
              productCategories={productCategories}
              onChange={setProductCategories}
            />
            <TagsSection productTags={productTags} onChange={setProductTags} />
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
          <CharacteristicsSection
            productCharacteristics={productCharacteristics}
            productId={id as string}
            onUpdate={() => refetch()}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default EditProductPage;
