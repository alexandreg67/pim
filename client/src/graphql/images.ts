import { gql } from '@apollo/client';

export const REMOVE_PRODUCT_IMAGE = gql`
  mutation RemoveProductImage($productId: String!, $imageId: String!) {
    removeProductImage(productId: $productId, imageId: $imageId)
  }
`;
