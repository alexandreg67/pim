import { gql } from '@apollo/client';

export const GET_TAGS = gql`
  query Tags {
    tags {
      id
      name
      description
    }
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      name
      description
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: String!, $input: UpdateTagInput!) {
    updateTag(id: $id, input: $input) {
      name
      description
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: String!) {
    deleteTag(id: $id)
  }
`;
