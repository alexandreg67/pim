import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Chip,
} from '@mui/material';
import { ProductStatus } from '../../../types/enum/product';
import { getStatusLabel } from '../../../utils/product.utils';
import { statusConfig } from '../../../config/status.config';
import { useNotification } from '../../../hooks/useNotification';

type GeneralInfo = {
  name: string;
  reference: string;
  shortDescription: string;
  description: string;
  price: string;
  status: ProductStatus;
  label?: string;
  brand: {
    name: string;
  };
};

type GeneralInfoSectionProps = {
  productInfo: GeneralInfo;
  onChange: (infos: Partial<GeneralInfo>) => void;
};

const GeneralInfoSection = ({
  productInfo,
  onChange,
}: GeneralInfoSectionProps) => {
  const { success, error: showError } = useNotification();

  const ALLOWED_STATUS_TRANSITIONS: Record<ProductStatus, ProductStatus[]> = {
    [ProductStatus.DRAFT]: [
      ProductStatus.PENDING_REVIEW,
      ProductStatus.DISABLED,
    ],
    [ProductStatus.PENDING_REVIEW]: [
      ProductStatus.PUBLISHED,
      ProductStatus.DISABLED,
      ProductStatus.PENDING_UPDATE,
    ],
    [ProductStatus.PUBLISHED]: [
      ProductStatus.DISABLED,
      ProductStatus.PENDING_UPDATE,
    ],
    [ProductStatus.DISABLED]: [
      ProductStatus.DRAFT,
      ProductStatus.PENDING_REVIEW,
    ],
    [ProductStatus.PENDING_UPDATE]: [
      ProductStatus.PUBLISHED,
      ProductStatus.DISABLED,
    ],
  };

  const validateStatusChange = (
    currentStatus: ProductStatus,
    newStatus: ProductStatus
  ): boolean => {
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      showError(
        `La transition de ${getStatusLabel(currentStatus)} vers ${getStatusLabel(newStatus)} n'est pas autorisée`
      );
      return false;
    }

    success(
      `La transition de ${getStatusLabel(currentStatus)} vers ${getStatusLabel(newStatus)}  statut est autorisée`
    );
    return true;
  };

  const handleChange = (field: keyof GeneralInfo, value: string) => {
    if (field === 'status') {
      const newStatus = value as ProductStatus;
      if (!validateStatusChange(productInfo.status, newStatus)) {
        return;
      }
    }

    if (field === 'price') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        showError('Le prix doit être un nombre positif');
        return;
      }
    }

    if (field === 'name' && !value.trim()) {
      showError('Le nom est requis');
      return;
    }

    onChange({ [field]: value });
  };

  return (
    <Grid container sx={{ px: 4, py: 2 }} spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Référence
        </Typography>
        <TextField
          fullWidth
          value={productInfo.reference}
          disabled
          size="small"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Marque
        </Typography>
        <TextField
          fullWidth
          value={productInfo.brand.name}
          disabled
          size="small"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Nom"
          value={productInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          size="small"
          required
          inputProps={{ maxLength: 150 }}
          helperText={`${productInfo.name.length}/150 caractères`}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description courte"
          value={productInfo.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          size="small"
          multiline
          rows={2}
          inputProps={{ maxLength: 300 }}
          helperText={`${productInfo.shortDescription.length}/300 caractères`}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          value={productInfo.description}
          onChange={(e) => handleChange('description', e.target.value)}
          size="small"
          multiline
          rows={4}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Prix"
          value={productInfo.price}
          onChange={(e) => handleChange('price', e.target.value)}
          size="small"
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Statut</InputLabel>
          <Select
            value={productInfo.status}
            onChange={(e) =>
              handleChange('status', e.target.value as ProductStatus)
            }
            label="Statut"
            renderValue={(selected) => (
              <Chip
                label={getStatusLabel(selected)}
                size="small"
                color={statusConfig[selected as ProductStatus].color}
              />
            )}
          >
            {Object.values(ProductStatus).map((status) => (
              <MenuItem key={status} value={status}>
                <Chip
                  label={statusConfig[status].label}
                  size="small"
                  color={statusConfig[status].color}
                  sx={{ mr: 1 }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default GeneralInfoSection;
