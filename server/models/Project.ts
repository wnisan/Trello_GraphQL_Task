import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId;
  tasks: mongoose.Types.ObjectId[];
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);


