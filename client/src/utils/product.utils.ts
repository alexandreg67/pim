import { statusDisplay } from '../config/status.config';
import { ProductStatus } from '../types/enum/product';

export const getStatusLabel = (status: string | null | undefined): string => {
  if (!status) return 'Inconnu';
  return statusDisplay[status as ProductStatus] || 'Inconnu';
};
