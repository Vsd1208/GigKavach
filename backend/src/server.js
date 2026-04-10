import "dotenv/config";
import http from "node:http";
import { initializeDatabaseBackedStore, persistStore } from "./db.js";
import { handleRequest } from "./router.js";
import { startSchedulers } from "./services/scheduler.js";
import { sendJson } from "./utils/http.js";

const requestedPort = Number(process.env.PORT || 4000);
const dbState = await initializeDatabaseBackedStore();

if (dbState.enabled) {
  console.log("GigShield database persistence enabled.");
} else {
  console.log("GigShield running with in-memory seed data. Set DATABASE_URL to enable Postgres persistence.");
}

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error) {
    if (!["GET", "OPTIONS"].includes(req.method)) {
      try {
        await persistStore();
      } catch (persistError) {
        console.error("Failed to persist store after request error:", persistError);
      }
    }
    sendJson(res, error.statusCode ?? 500, {
      error: error.message ?? "Unexpected server error",
      details: error.details ?? null
    });
  }
});

let activePort = requestedPort;

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    activePort += 1;
    console.warn(`Port ${activePort - 1} is busy. Retrying on ${activePort}.`);
    server.listen(activePort);
    return;
  }

  console.error("Failed to start GigShield backend:", error);
  process.exitCode = 1;
});

server.listen(activePort, () => {
  startSchedulers();
  console.log(`GigShield backend listening on http://localhost:${activePort}`);
});
