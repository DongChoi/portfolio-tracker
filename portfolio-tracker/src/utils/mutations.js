import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($username: String!, $passwordL String!) {
        login(username: $username, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`

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
  mutation savePosition($purchaseDate: String!, $purchasePrice: Float!, $symbol: String!, $currentPrice: Float!) {
    savePosition(purchaseDate: $purchaseDate, purchasePrice: $purchasePrice, symbol: $symbol, currentPrice: $currentPrice) {
        _id
        username
        email
        positions {
            positionId
            purchaseDate
            purchasePrice
            symbol
            currentPrice
        }
    }
  }
`

export const REMOVE_POSITION = gql`
  mutation removePosition($positionId: ID!) {
    removePosition(positionId: $positionId) {
        _id
        username
        email
        positions {
            positionId
            purchaseDate
            purchasePrice
            symbol
            currentPrice
        }
    }
  }
`