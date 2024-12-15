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

export const GET_PRODUCT = gql`
  query GetProduct($productId: String!) {
    product(id: $productId) {
      id
      name
      reference
      shortDescription
      description
      price
      status
      label
      createdAt
      updatedAt
      deletedAt
      brand {
        id
        name
      }
      contact {
        email
        phone
        country
      }
      categories {
        id
        name
      }
      tags {
        id
        name
      }
      images {
        id
        url
        altText
        isPrimary
      }
      productCharacteristics {
        id
        characteristic {
          id
          name
        }
        value
      }
    }
  }
`;
