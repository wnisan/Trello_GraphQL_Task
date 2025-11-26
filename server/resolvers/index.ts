import { userResolver } from './userResolver';
import { projectResolver } from './projectResolver';
import { taskResolver } from './taskResolver';

export const resolvers = [
  userResolver,
  projectResolver,
  taskResolver
];