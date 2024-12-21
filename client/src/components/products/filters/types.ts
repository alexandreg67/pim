import { ProductStatus } from '../../../types/enum/product';

export interface FilterState {
  searchQuery?: string;
  status: ProductStatus | '';
  brandIds: string[];
}
