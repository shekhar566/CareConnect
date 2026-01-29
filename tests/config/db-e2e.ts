import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.test" });

const MONGODB_URI = process.env.MONGODB_URI as string;

export function isE2EDBConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectE2EDB() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (isE2EDBConnected()) {
    console.log("Already connected to E2E test database");
    // eslint-disable-next-line no-useless-return
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, { dbName: "devflow" });
    console.log("Connected to E2E test databsase");
  } catch (error) {
    console.log("Connection to E2E test databsase failed:", error);
    throw error;
  }
}

export async function disconnectE2EDB() {
  if (!isE2EDBConnected()) {
    console.log("Connected to E2E test databsase");
    // eslint-disable-next-line no-useless-return
    return;
  }

  try {
    await mongoose.disconnect();
    console.log("Disconnected from E2E test databsase");
  } catch (error) {
    console.log("Disconnection from E2E test databsase failed:", error);
    throw error;
  }
}

export async function cleanupE2EData() {
  if (!isE2EDBConnected()) {
    console.log("E2E test database is not connected");
    // eslint-disable-next-line no-useless-return
    return;
  }

  try {
    await mongoose.connection.dropDatabase();
    console.log("Dropped entire E2E test database");
  } catch (err) {
    console.error("Clearup  E2E test data failed", err);
  }
}

export function getE2EConnectionInfo() {
  const { connection } = mongoose;

  return {
    dbName: connection.db?.databaseName || null,
    host: connection.host || null,
    port: connection.port || null,
    isConnected: isE2EDBConnected(),
  };
}
