import { gql } from 'apollo-server-express';

// gql - шаблонная строка для определения GraphQL схем
export const userType = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    projects: [Project]
  }

  input UserInput {
    firstname: String!
    lastname: String!
    email: String!
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): Boolean
  }
`;