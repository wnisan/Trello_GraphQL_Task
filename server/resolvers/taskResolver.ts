import { getRepository } from "typeorm";
import { Task } from "../entities/Task";
import { Project } from "../entities/Project";

export const taskResolver = {
  Query: {
    tasks: async () => {
      const taskRepository = getRepository(Task);
      return await taskRepository.find({ relations: ["project"] });
    },

    task: async ( { id }: { id: number }) => {
      const taskRepository = getRepository(Task);
      return await taskRepository.findOne({
        where: { id },
        relations: ["project"]
      });
    }
  },

  Mutation: {
    createTask: async ( { input }: { input: any }) => {
      const taskRepository = getRepository(Task);
      const projectRepository = getRepository(Project);

      const project = await projectRepository.findOne(input.projectId);
      if (!project) throw new Error("Project not found");

      const task = taskRepository.create({
        ...input,
        project: project
      });
      return await taskRepository.save(task);
    },

    updateTask: async ( { id, input }: { id: number, input: any }) => {
      const taskRepository = getRepository(Task);
      const task = await taskRepository.findOne({
        where: { id },
        relations: ["project"]
      });
      
      if (!task) throw new Error("Task not found");

      taskRepository.merge(task, input);
      return await taskRepository.save(task);
    },

    updateTaskStatus: async ( { id, status }: { id: number, status: string }) => {
      const taskRepository = getRepository(Task);
      const task = await taskRepository.findOne({where: { id }});
      
      if (!task) throw new Error("Task not found");

      task.status = status;
      return await taskRepository.save(task);
    },

    deleteTask: async ( { id }: { id: number }) => {
      const taskRepository = getRepository(Task);
      const result = await taskRepository.delete(id);
      return result.affected > 0;
    }
  }
};