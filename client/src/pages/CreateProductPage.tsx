import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, NavigateNext, NavigateBefore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../generated/graphql-types';
import { useNotification } from '../hooks/useNotification';
import GeneralInfoSection from '../components/products/edit/GeneralInfoSection';
import CategoriesSection from '../components/products/edit/CategoriesSection';
import TagsSection from '../components/products/edit/TagsSection';
import { ProductStatus } from '../types/enum/product';
import ContactSection from '../components/products/edit/ContactSection';
import { Contact } from '../types/contact.types';

const steps = ['Informations générales', 'Catégories & Tags', 'Contact'];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [createProduct, { loading }] = useCreateProductMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [productInfo, setProductInfo] = useState({
    reference: '',
    name: '',
    shortDescription: '',
    description: '',
    status: 'draft' as ProductStatus,
    price: '',
    brand: { id: '', name: '' },
  });
  const [productCategories, setProductCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [productTags, setProductTags] = useState<
    { id: string; name: string }[]
  >([]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateGeneralInfo()) {
        if (!productInfo.reference.trim()) {
          return showError('La référence est obligatoire');
        }
        if (!productInfo.name.trim()) {
          return showError('Le nom est obligatoire');
        }
        if (!productInfo.price || parseFloat(productInfo.price) <= 0) {
          return showError('Le prix doit être un nombre positif');
        }
        if (!productInfo.brand.id) {
          return showError('Veuillez sélectionner une marque');
        }
        return showError('Veuillez remplir tous les champs obligatoires');
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateGeneralInfo = () => {
    if (!productInfo.reference.trim()) return false;
    if (!productInfo.name.trim()) return false;
    if (!productInfo.price) return false;
    if (!productInfo.brand.id) return false;

    // Vérification supplémentaire pour le prix
    const numericPrice = parseFloat(productInfo.price);
    if (isNaN(numericPrice) || numericPrice <= 0) return false;

    return true;
  };

  const handleCreateProduct = async () => {
    if (!selectedContact) {
      showError('Veuillez sélectionner un contact');
      return;
    }

    try {
      const createProductInput = {
        reference: productInfo.reference,
        name: productInfo.name,
        shortDescription: productInfo.shortDescription,
        description: productInfo.description,
        status: productInfo.status,
        price: productInfo.price,
        brandId: productInfo.brand.id,
        contactId: selectedContact.id,
        categoryIds: productCategories.map((c) => c.id),
        tagIds: productTags.map((t) => t.id),
      };

      const { data } = await createProduct({
        variables: {
          input: createProductInput,
        },
      });

      if (data?.createProduct?.id) {
        success('Produit créé avec succès');
        navigate(`/products/${data.createProduct.id}/edit`);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      showError('Erreur lors de la création du produit');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <GeneralInfoSection
            productInfo={productInfo}
            onChange={(info) =>
              setProductInfo((prev) => ({ ...prev, ...info }))
            }
            mode="create"
          />
        );
      case 1:
        return (
          <Box>
            <CategoriesSection
              productCategories={productCategories}
              onChange={setProductCategories}
            />
            <TagsSection productTags={productTags} onChange={setProductTags} />
          </Box>
        );
      case 2:
        return (
          <ContactSection
            brandId={productInfo.brand.id}
            selectedContact={selectedContact}
            onChange={(contact: Contact | null) => setSelectedContact(contact)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button
          onClick={() => navigate('/products')}
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Retour aux produits
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, minHeight: '400px' }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<NavigateBefore />}
            disabled={activeStep === 0}
          >
            Précédent
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleCreateProduct}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Créer le produit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProductPage;
