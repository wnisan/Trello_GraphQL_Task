import { gql } from 'apollo-server-express';
import { userType } from './userType';
import { projectType } from './projectType';
import { taskType } from './taskType';

const rootType = gql`
  # точка входа для всех запросов
  type Query {
    _empty: String  
  }

  # точка входа для всех изменений
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [rootType, userType, projectType, taskType];