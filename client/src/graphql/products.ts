import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $status: String
    $query: String
    $limit: Int!
    $page: Int!
  ) {
    products(page: $page, limit: $limit, status: $status, query: $query) {
      items {
        id
        name
        reference
        price
        status
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
