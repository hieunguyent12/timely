import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    folderId: { type: String, required: true },
    folderName: { type: String, required: true },
    name: { type: String, required: true },
    reminder: { type: String, required: true },
    subtasks: [
      {
        name: { type: String },
        status: { type: String, required: true },
      },
    ],
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.models.tasks || mongoose.model("tasks", taskSchema);

model.createIndexes({ name: "text" });

export default mongoose.models.tasks || mongoose.model("tasks", taskSchema);
