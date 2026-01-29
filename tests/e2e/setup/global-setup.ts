import {
  cleanupE2EData,
  connectE2EDB,
  getE2EConnectionInfo,
  isE2EDBConnected,
} from "@/tests/config/db-e2e";
import { seed } from "../seeders/e2e.seeder";

const globalSetup = async () => {
  console.log("🚀 Starting E2E test global setup...");

  try {
    await connectE2EDB();

    const { dbName, host, port, isConnected } = getE2EConnectionInfo();
    console.log("E2E Database Connection Info: ", {
      dbName,
      host,
      port,
      isConnected,
    });

    if (!isE2EDBConnected) {
      throw new Error("Failed to establish a stable E2E databse connection");
    }

    await cleanupE2EData();

    const seedData = await seed();

    console.log("E2E global setup completed succuesfully");
    console.log(`Created ${Object.keys(seedData.users).length} tests users`);
    console.log(
      `Created ${Object.keys(seedData.questions).length} tests questions`
    );
  } catch (e) {
    console.log("E2E global setup  failed", e);
    process.exit(1);
  }
};

export default globalSetup;
