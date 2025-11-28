import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  project: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "TODO" },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true }
}, {
  timestamps: true
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);


