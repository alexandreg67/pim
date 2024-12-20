export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  DISABLED = 'disabled',
  PENDING_UPDATE = 'pending_update',
}

export const statusConfig = {
  [ProductStatus.DRAFT]: {
    label: 'Brouillon',
    color: 'default',
  },
  [ProductStatus.PENDING_REVIEW]: {
    label: 'En attente de validation',
    color: 'warning',
  },
  [ProductStatus.PUBLISHED]: {
    label: 'Publié',
    color: 'success',
  },
  [ProductStatus.DISABLED]: {
    label: 'Désactivé',
    color: 'error',
  },
  [ProductStatus.PENDING_UPDATE]: {
    label: 'Mise à jour en attente',
    color: 'info',
  },
} as const;

export interface FilterState {
  searchQuery?: string;
  status: ProductStatus | '';
  brandIds: string[];
}

// export interface FilterState {
//   searchQuery?: string;
//   status?: ProductStatus;
//   brandIds: string[];
//   categories?: string[];
//   priceRange?: {
//     min: number;
//     max: number;
//   };
// }
