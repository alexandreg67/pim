import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($page: Int!, $limit: Int!) {
    users(page: $page, limit: $limit) {
      id
      lastName
      firstName
      email
      phone
      role
      isFirstLogin
      startDate
      endDate
      createdAt
      updatedAt
      deletedAt
      isActive
    }
    totalUsers
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      startDate
      endDate
      updatedAt
      createdAt
    }
  }
`;
