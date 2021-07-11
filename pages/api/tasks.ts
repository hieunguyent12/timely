import type { NextApiResponse } from "next";
import { Document } from "mongoose";

import Task from "../../db/taskModel";
import connectDB from "../../db/connectDB";
import authMiddleware from "../../utils/authMiddleware";
import { ReqUser, TaskType } from "../../types/api";

export default async function handler(req: ReqUser, res: NextApiResponse) {
  authMiddleware(req);

  if (!req.user) {
    return res.status(400).json({
      error: "not logged in",
    });
  }

  try {
    await connectDB();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "server error" });
  }

  if (req.method === "POST") {
    if (!req.body.name || !req.body.folderId || !req.body.folderName) {
      return res.status(400).json({
        error: "insufficient data to create new task",
      });
    }

    const newTask = new Task({
      owner: req.user.userId,
      folderId: req.body.folderId,
      folderName: req.body.folderName,
      name: req.body.name,
      reminder: "none",
      subtasks: [],
      status: "active",
    });

    await newTask.save();

    return res.json(newTask);
  }

  const { operation } = req.body;

  if (req.method === "PUT") {
    if (!req.body.taskId) {
      return res.status(400).json({
        error: "insufficient data to modify task",
      });
    }

    const task: TaskType & Document = await Task.findById(req.body.taskId);

    if (task.owner !== req.user.userId) {
      return res.status(400).json({
        error: "not authorized to modify task",
      });
    }

    if (operation === "STATUS") {
      task.status = req.body.status;
    }

    if (operation === "REMINDER" && req.body.due) {
      task.reminder = req.body.due;
    }

    await task.save();

    return res.json(task);
  }

  if (req.method === "DELETE") {
    if (!req.body.taskId) {
      return res.status(400).json({
        error: "insufficient data to modify task",
      });
    }

    await Task.findOneAndDelete({
      owner: req.user.userId,
      _id: req.body.taskId,
    });

    return res.json({ deleted: true });
  }
}
