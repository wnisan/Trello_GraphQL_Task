import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { Query } from "typeorm/driver/Query.js";

export const userResolver = {
    Query: {
        users: async () => {
            const userRepository = getRepository(User);
            return await userRepository.find({relations: ["projects"]});
        },

        user: async ( { id }: { id: number }) => {
            // достаем id из аргументов
            const userRepository = getRepository(User);
            return await userRepository.findOne({ 
            where: { id },
            relations: ["projects"] 
          });
        },
    },

    Mutation: {
    createUser: async ( { input }: { input: any }) => {
      // достаем input из аргументов
      
      const userRepository = getRepository(User);
      const user = userRepository.create(input);
      return await userRepository.save(user);
    },

    updateUser: async ( { id, input }: { id: number, input: any }) => {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({where: { id }});
      if (!user) throw new Error("User not found");
      
      userRepository.merge(user, input);
      return await userRepository.save(user);
    },

    deleteUser: async ({ id }: { id: number }) => {
      const userRepository = getRepository(User);
      const result = await userRepository.delete(id);
      return result.affected! > 0;
    }
  }
};