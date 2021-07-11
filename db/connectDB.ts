import mongoose from "mongoose";

export default function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGODB_CONNECTION_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
