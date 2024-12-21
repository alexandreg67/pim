import { ProductStatus } from '../types/enum/product';

// Mapping pour l'affichage en français
export const statusDisplay = {
  [ProductStatus.DRAFT]: 'Brouillon',
  [ProductStatus.PENDING_REVIEW]: 'En attente de validation',
  [ProductStatus.PUBLISHED]: 'Publié',
  [ProductStatus.DISABLED]: 'Désactivé',
  [ProductStatus.PENDING_UPDATE]: 'Mise à jour en attente',
} as const;

export const statusConfig = {
  [ProductStatus.DRAFT]: {
    label: statusDisplay[ProductStatus.DRAFT],
    color: 'default',
  },
  [ProductStatus.PENDING_REVIEW]: {
    label: statusDisplay[ProductStatus.PENDING_REVIEW],
    color: 'warning',
  },
  [ProductStatus.PUBLISHED]: {
    label: statusDisplay[ProductStatus.PUBLISHED],
    color: 'success',
  },
  [ProductStatus.DISABLED]: {
    label: statusDisplay[ProductStatus.DISABLED],
    color: 'error',
  },
  [ProductStatus.PENDING_UPDATE]: {
    label: statusDisplay[ProductStatus.PENDING_UPDATE],
    color: 'info',
  },
} as const;
