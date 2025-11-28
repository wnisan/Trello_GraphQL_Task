import { Task } from "../models/Task";
import { Project } from "../models/Project";

export const taskResolver = {
  Query: {
    tasks: async () => {
      return await Task.find().populate("project");
    },

    task: async (_: any, { id }: { id: string }) => {
      return await Task.findById(id).populate("project");
    }
  },

  Mutation: {
    createTask: async (_: any, { input }: { input: any }) => {
      const project = await Project.findById(input.projectId);
      if (!project) throw new Error("Project not found");

      const task = new Task({
        title: input.title,
        description: input.description,
        status: input.status || "TODO",
        project: input.projectId
      });

      const savedTask = await task.save();

      // Добавляем задачу в массив задач проекта
      project.tasks.push(savedTask._id);
      await project.save();

      return savedTask;
    },

    updateTask: async (_: any, { id, input }: { id: string, input: any }) => {
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).populate("project");
      
      if (!task) throw new Error("Task not found");
      return task;
    },

    updateTaskStatus: async (_: any, { id, status }: { id: string, status: string }) => {
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      );
      
      if (!task) throw new Error("Task not found");
      return task;
    },

    deleteTask: async (_: any, { id }: { id: string }) => {
      const task = await Task.findById(id);
      if (!task) return false;

      // Удаляем задачу из массива задач проекта
      await Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: id }
      });

      const result = await Task.findByIdAndDelete(id);
      return !!result;
    }
  }
};