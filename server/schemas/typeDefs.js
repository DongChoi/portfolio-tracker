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
    positionId: ID!
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
      purchaseDate: String!
      purchasePrice: Float!
      symbol: String!
      purchaseQty: Float!
    ): User
    removePosition(positionId: ID!): User
  }
`;

module.exports = typeDefs;
