import { getRepository } from "typeorm";
import { Project } from "../entities/Project";
import { User } from "../entities/User";

export const projectResolver = {
  Query: {
    projects: async () => {
      const projectRepository = getRepository(Project);
      return await projectRepository.find({ 
        relations: ["user", "tasks"] 
      });
    },

    project: async ( { id }: { id: number }) => {
      const projectRepository = getRepository(Project);
      return await projectRepository.findOne({
        where: { id },
        relations: ["user", "tasks"]
      });
    }
  },

  Mutation: {
    createProject: async ( { input }: { input: any }) => {
      const projectRepository = getRepository(Project);
      const userRepository = getRepository(User);

      const user = await userRepository.findOne(input.userId);
      if (!user) throw new Error("User not found");
      const project = projectRepository.create({
        ...input,
        user: user
      });

      return await projectRepository.save(project);
    },

    updateProject: async ( { id, input }: { id: number, input: any }) => {
      const projectRepository = getRepository(Project);
      const project = await projectRepository.findOne({
        where: { id },
        relations: ["user"]
      });
      
      if (!project) throw new Error("Project not found");

      projectRepository.merge(project, input);
      return await projectRepository.save(project);
    },

    deleteProject: async ( { id }: { id: number }) => {
      const projectRepository = getRepository(Project);
      const result = await projectRepository.delete(id);
      return result.affected > 0;
    }
  }
};