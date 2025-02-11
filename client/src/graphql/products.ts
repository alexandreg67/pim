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
        price
        status
        createdAt
        updatedAt
        shortDescription
        reference
        categories {
          name
        }
        tags {
          name
        }
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      shortDescription
      description
      categories {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      reference
      shortDescription
      description
      price
      status
      label
      brand {
        id
        name
      }
      contact {
        id
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
    }
  }
`;

export const ADD_PRODUCT_IMAGE = gql`
  mutation AddProductImage($input: AddProductImageInput!) {
    addProductImage(input: $input) {
      id
      images {
        id
        url
        altText
        isPrimary
      }
    }
  }
`;
