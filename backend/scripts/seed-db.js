import "dotenv/config";
import { closeDatabase, seedDatabaseFromStaticData } from "../src/db.js";

const reset = process.argv.includes("--reset");

try {
  const result = await seedDatabaseFromStaticData({ reset });
  console.log(`GigShield static data seeded${reset ? " after reset" : ""}.`);
  for (const collection of result.collections) {
    console.log(`- ${collection.name}: ${collection.records}`);
  }
} catch (error) {
  console.error("Failed to seed GigShield database:", error.message);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
