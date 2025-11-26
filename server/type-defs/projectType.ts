import { gql } from 'apollo-server-express';

export const projectType = gql`
  type Project {
    id: ID!
    title: String!
    description: String!
    user: User!
    tasks: [Task]
  }

  input ProjectInput {
    title: String!
    description: String!
    userId: ID!  
  }

  extend type Query {
    projects: [Project]
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(input: ProjectInput!): Project
    updateProject(id: ID!, input: ProjectInput!): Project
    deleteProject(id: ID!): Boolean
  }
`;