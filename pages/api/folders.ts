import type { NextApiResponse } from "next";

import Folder from "../../db/folderModel";
import connectDB from "../../db/connectDB";
import authMiddleware from "../../utils/authMiddleware";
import { ReqUser } from "../../types/api";

export default async function handler(req: ReqUser, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({
      error: "invalid request",
    });
  }

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

  if (!req.body.name) {
    return res.status(400).json({
      error: "must provide name for folder",
    });
  }

  const newFolder = new Folder({
    owner: req.user.userId,
    name: req.body.name,
  });

  await newFolder.save();

  res.json(newFolder);
}
