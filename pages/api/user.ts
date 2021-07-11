import type { NextApiRequest, NextApiResponse } from "next";

import User from "../../db/userModel";
import connectDB from "../../db/connectDB";
import authMiddleware from "../../utils/authMiddleware";
import { ReqUser } from "../../types/api";
import { DBUserType } from "../../types/db";

export default async function handler(req: ReqUser, res: NextApiResponse) {
  try {
    await connectDB();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "server error" });
  }

  authMiddleware(req);

  if (!req.user) {
    return res.redirect("/");
  }

  const user: DBUserType = await User.findById(req.user.userId);

  if (user) {
    res.json({
      username: user.username,
      name: user.name,
      avatar_url: user.avatar_url,
    });
  } else {
    res.status(500).json({
      error: "can't find user",
    });
  }
}
