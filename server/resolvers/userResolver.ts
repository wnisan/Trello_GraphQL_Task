import { User } from "../models/User";
import { Project } from "../models/Project";
import { Task } from "../models/Task";

export const userResolver = {
    Query: {
        users: async () => {
            return await User.find().populate("projects");
        },

        user: async (_: any, { id }: { id: string }) => {
            return await User.findById(id).populate("projects");
        },
    },

    Mutation: {
        createUser: async (_: any, { input }: { input: any }) => {
            const user = new User(input);
            return await user.save();
        },

        updateUser: async (_: any, { id, input }: { id: string, input: any }) => {
            const user = await User.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true, runValidators: true }
            );
            if (!user) throw new Error("User not found");
            return user;
        },

        deleteUser: async (_: any, { id }: { id: string }) => {
            const user = await User.findById(id);
            if (!user) return false;

            // Удаляем все проекты пользователя 
            const projects = await Project.find({ user: id });
            const projectIds = projects.map(p => p._id);

            // Удаляем все задачи этих проектов
            await Task.deleteMany({ project: { $in: projectIds } });

            // Удаляем все проекты
            await Project.deleteMany({ user: id });

            // Удаляем пользователя
            const result = await User.findByIdAndDelete(id);
            return !!result;
        }
    }
};