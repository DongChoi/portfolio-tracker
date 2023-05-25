const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    positionCount: Int
    positions: [Position]
  }
  type Position {
    positionId: String!
    purchaseDate: String!
    purchasePrice: Float!
    symbol: String!
    purchaseQty: Float!
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    user: User
  }
  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    savePosition(
      positionId: String!
      purchaseDate: String!
      purchasePrice: Float!
      symbol: String!
      purchaseQty: Float!
    ): User
    removePosition(positionId: String!): User
  }
`;

module.exports = typeDefs;
