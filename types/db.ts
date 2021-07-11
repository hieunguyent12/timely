import { Document } from "mongoose";

export interface DBUserType extends Document {
  googleId: string;
  name: string;
  username: string;
  password: string;
  avatar_url: string;
}
