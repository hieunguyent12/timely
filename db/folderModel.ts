import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const model =
  mongoose.models.folders || mongoose.model("folders", folderSchema);

// folderSchema.index({ name: "text" });
model.createIndexes({ name: "text" });

export default model;
