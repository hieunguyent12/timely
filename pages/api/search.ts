import type { NextApiResponse } from "next";

import authMiddleware from "../../utils/authMiddleware";
import { ReqUser } from "../../types/api";
import Folder from "../../db/folderModel";
import Task from "../../db/taskModel";

export default async function handler(req: ReqUser, res: NextApiResponse) {
  console.log("search!!!!");
  authMiddleware(req);

  if (!req.user) {
    return res.status(400).json({
      error: "not logged in",
    });
  }

  const searchString = req.query?.search as string;
  console.log(searchString);

  if (!searchString) {
    return res.status(400).json({
      error: "nothing to search",
    });
  }

  const folders = Folder.find({
    $text: { $search: searchString },
  }).limit(5);

  const tasks = Task.find({
    $text: { $search: searchString },
  });

  console.log(searchString);

  Promise.all([folders, tasks])
    .then((results) => {
      res.json({
        folders: results[0],
        tasks: results[1],
      });
    })
    .catch((e) => {
      console.log(e);

      res.status(500).json({
        error: "something went wrong",
      });
    });
}
