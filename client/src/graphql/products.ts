import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      items {
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
      total
      hasMore
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $page: Int, $limit: Int) {
    searchProducts(query: $query, page: $page, limit: $limit) {
      items {
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
      total
      hasMore
    }
  }
`;
