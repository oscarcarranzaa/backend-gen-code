import mongoose from "mongoose";

const isConn = {
  isConnected: false,
};
export default async function dbConnect() {
  const db = await mongoose.connect(process.env.MONGODB_URL);

  if (isConn.isConnected) return;

  isConn.isConnected = db.connections[0].readyState;
}
