import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_POSITION = gql`
  mutation savePosition(
    $positionId: String!
    $purchaseDate: String!
    $purchasePrice: Float!
    $symbol: String!
    $purchaseQty: Float!
  ) {
    savePosition(
      positionId: $positionId
      purchaseDate: $purchaseDate
      purchasePrice: $purchasePrice
      symbol: $symbol
      purchaseQty: $purchaseQty
    ) {
      _id
      username
      email
      positions {
        positionId
        purchaseDate
        purchasePrice
        symbol
        purchaseQty
      }
    }
  }
`;

export const REMOVE_POSITION = gql`
  mutation removePosition($positionId: String!) {
    removePosition(positionId: $positionId) {
      _id
      username
      email
      positions {
        positionId
        purchaseDate
        purchasePrice
        symbol
        purchaseQty
      }
    }
  }
`;
