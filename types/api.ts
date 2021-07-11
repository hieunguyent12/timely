import type { NextApiRequest } from "next";

export interface UserType {
  userId: string;
  googleId: string;
  username: string;
  avatar_url: string;
  name: string;
}

export interface ReqUser extends NextApiRequest {
  user: UserType;
}

export interface FolderType {
  _id: string;
  owner: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskType {
  _id: string;
  // id: string;
  name: string;
  status: string;
}
export interface TaskType {
  _id: string;
  owner: string;
  folderId: string;
  folderName: string;
  name: string;
  reminder: string;
  subtasks: SubtaskType[];
  status: "active" | "done";
  createdAt: string;
  updatedAt: string;
}
