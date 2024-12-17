import { gql } from '@apollo/client';

export const BRANDS = gql`
  query getBrands($limit: Int!, $page: Int!, $search: String) {
    brands(limit: $limit, page: $page, search: $search) {
      id
      name
      description
      logo
      createdAt
      totalProducts
      contacts {
        id
        email
        phone
        country
      }
      products {
        id
        name
      }
    }
    totalBrands
  }
`;

export const GET_BRAND = gql`
  query getBrand($brandId: String!, $contactLimit: Int, $contactOffset: Int) {
    brand(id: $brandId) {
      id
      name
      logo
      description
      totalProducts
      totalContacts
      contacts(contactLimit: $contactLimit, contactOffset: $contactOffset) {
        id
        email
        phone
        country
        totalProducts
      }
      products {
        id
        name
      }
    }
  }
`;
