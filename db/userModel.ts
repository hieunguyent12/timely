import mongoose from "mongoose";
import { DBUserType } from "../types/db";

const userSchema = new mongoose.Schema<DBUserType>(
  {
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar_url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text" });

export default mongoose.models.users ||
  mongoose.model<DBUserType>("users", userSchema);
