import { gql } from '@apollo/client';

export const ADD_CHARACTERISTIC = gql`
  mutation AddProductCharacteristic(
    $productId: String!
    $characteristicId: String!
    $value: String!
  ) {
    addProductCharacteristic(
      productId: $productId
      characteristicId: $characteristicId
      value: $value
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_CHARACTERISTIC_VALUE = gql`
  mutation UpdateProductCharacteristic(
    $productId: String!
    $characteristicId: String!
    $value: String!
  ) {
    updateProductCharacteristicValue(
      productId: $productId
      characteristicId: $characteristicId
      value: $value
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          name
        }
      }
    }
  }
`;

export const REMOVE_CHARACTERISTIC_VALUE = gql`
  mutation RemoveProductCharacteristic(
    $productId: String!
    $characteristicId: String!
  ) {
    removeProductCharacteristic(
      productId: $productId
      characteristicId: $characteristicId
    ) {
      id
      productCharacteristics {
        id
        value
        characteristic {
          name
        }
      }
    }
  }
`;
