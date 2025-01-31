import { gql } from '@apollo/client';

export const GET_HISTORY = gql`
  query GetHistory {
    getHistory {
      id
      createdAt
      action {
        name
        description
        type
      }
      user {
        firstName
        lastName
      }
      product {
        name
        reference
      }
    }
  }
`;
