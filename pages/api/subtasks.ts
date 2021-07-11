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
    return res.status(500).json({
      error: "server error",
    });
  }

  if (req.method === "POST") {
    if (!req.body.taskId || !req.body.subtask) {
      return res.status(400).json({
        error: "insufficient data to process request",
      });
    }

    const task: TaskType & Document = await Task.findById(req.body.taskId);
    task.subtasks = [...task.subtasks, req.body.subtask];

    await task.save();

    return res.json(task);
  }
}
