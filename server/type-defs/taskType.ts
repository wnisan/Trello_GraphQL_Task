import { gql } from 'apollo-server-express';

export const taskType = gql`
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    project: Project!
  }

  input TaskInput {
    title: String!
    description: String!
    projectId: ID!  
    status: String
  }

  extend type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: TaskInput!): Task
    updateTask(id: ID!, input: TaskInput!): Task
    deleteTask(id: ID!): Boolean
    updateTaskStatus(id: ID!, status: String!): Task  
  }
`;