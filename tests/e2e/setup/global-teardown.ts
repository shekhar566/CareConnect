import { cleanupE2EData, disconnectE2EDB } from "@/tests/config/db-e2e";

const globaTeardown = async () => {
  console.log("Starting E2E test global teardown...");

  try {
    await cleanupE2EData();
    await disconnectE2EDB();

    console.log("E2E global teardown completed successfully");
    console.log("Test data cleanup");
    console.log("Database connection  closed");
  } catch (e) {
    console.log("E2E global teardown failed: ", e);
  }
};

export default globaTeardown;
