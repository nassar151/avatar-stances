import { createServer } from "node:http";
import { join } from "node:path";
import { openReadyDb } from "../lib/db.mjs";
import { ROOT_DIR } from "../lib/paths.mjs";
import { handleApi } from "./api.mjs";
import { sendError } from "./http.mjs";
import { normalizePathname, resolvePublicFile, sendFile } from "./static.mjs";

const DEFAULT_PORT = 3333;
const WEB_ROOT = join(ROOT_DIR, "web");

const db = openReadyDb();
const port = Number(process.env.PORT) || DEFAULT_PORT;

const server = createServer(async (req, res) => {
  try {
    const pathname = normalizePathname(req.url ?? "/");

    if (pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, db, pathname);
      if (!handled) {
        sendError(res, 404, "Not found");
      }
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendError(res, 405, "Method not allowed");
      return;
    }

    const filePath = resolvePublicFile(WEB_ROOT, pathname);
    if (!filePath || !sendFile(res, filePath)) {
      sendError(res, 404, "Not found");
    }
  } catch (error) {
    const status = error.statusCode === 400 ? 400 : 500;
    const message = status === 400 ? error.message : "Internal server error";
    sendError(res, status, message);
  }
});

server.listen(port, () => {
  console.log(`Avatar stances UI: http://127.0.0.1:${port}`);
});
