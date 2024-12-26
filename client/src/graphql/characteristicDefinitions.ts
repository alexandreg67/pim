import { gql } from '@apollo/client';

export const GET_CHARACTERISTIC_DEFINITIONS = gql`
  query GetCharacteristicDefinitions {
    characteristicDefinitions {
      id
      name
    }
  }
`;

export const GET_CHARACTERISTIC_DEFINITION = gql`
  query GetCharacteristicDefinition($id: ID!) {
    characteristicDefinition(id: $id) {
      id
      name
      productCharacteristics {
        id
        value
      }
    }
  }
`;
