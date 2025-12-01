import { Project } from "../models/Project";
import { User } from "../models/User";
import { Task } from "../models/Task";
import mongoose from "mongoose";

export const projectResolver = {
  Query: {
    projects: async () => {
      return await Project.find().populate("user").populate("tasks");
    },

    project: async (_: any, { id }: { id: string }) => {
      const projectId = new mongoose.Types.ObjectId(id);
      return await Project.findById(projectId).populate("user").populate("tasks");
    }
  },

  Mutation: {
    createProject: async (_: any, { input }: { input: any }) => {
      const userId = new mongoose.Types.ObjectId(input.userId);
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const project = new Project({
        title: input.title,
        description: input.description,
        user: userId
      });

      const savedProject = await project.save();
      
      user.projects.push(savedProject._id);
      await user.save();

      return await savedProject.populate("user");
    },

    updateProject: async (_: any, { id, input }: { id: string, input: any }) => {
      const projectId = new mongoose.Types.ObjectId(id);
      const existingProject = await Project.findById(projectId);
      if (!existingProject) throw new Error("Project not found");

      if (input.userId && input.userId !== existingProject.user.toString()) {
        const newUserId = new mongoose.Types.ObjectId(input.userId);
        
        await User.findByIdAndUpdate(existingProject.user, {
          $pull: { projects: projectId }
        });

        const newUser = await User.findById(newUserId);
        if (!newUser) throw new Error("User not found");

        newUser.projects.push(projectId);
        await newUser.save();

        input.user = newUserId;
        delete input.userId;
      }

      const project = await Project.findByIdAndUpdate(
        projectId,
        { $set: input },
        { new: true, runValidators: true }
      ).populate("user").populate("tasks");
      
      return project;
    },

    deleteProject: async (_: any, { id }: { id: string }) => {
      const projectId = new mongoose.Types.ObjectId(id);
      const project = await Project.findById(projectId);
      if (!project) return false;

      await User.findByIdAndUpdate(project.user, {
        $pull: { projects: projectId }
      });

      await Task.deleteMany({ project: projectId });

      const result = await Project.findByIdAndDelete(projectId);
      return !!result;
    }
  }
};