import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      id
      name
      reference
      price
      status
      label
      createdAt
      brand {
        name
      }
    }
    dashboardStats {
      totalProducts
    }
  }
`;
