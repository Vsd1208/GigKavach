import http from "node:http";
import { handleRequest } from "./router.js";
import { startSchedulers } from "./services/scheduler.js";
import { sendJson } from "./utils/http.js";

const port = Number(process.env.PORT || 4000);

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error) {
    sendJson(res, error.statusCode ?? 500, {
      error: error.message ?? "Unexpected server error",
      details: error.details ?? null
    });
  }
});

server.listen(port, () => {
  startSchedulers();
  console.log(`GigShield backend listening on http://localhost:${port}`);
});
