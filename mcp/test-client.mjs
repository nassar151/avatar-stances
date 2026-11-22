import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DB_PATH } from "../lib/paths.mjs";
import { matchTriggers } from "../lib/trigger-match.mjs";
import { createMessageReader, encodeMessage } from "./stdio.mjs";

const here = dirname(fileURLToPath(import.meta.url));

export async function startServerOnSnapshot(clientName) {
  const workDir = mkdtempSync(join(tmpdir(), "avatar-stances-"));
  const dbCopy = join(workDir, "avatars.sqlite");
  const live = new DatabaseSync(DB_PATH, { readOnly: true });
  live.prepare("VACUUM INTO ?").run(dbCopy);
  live.close();

  const server = spawn(process.execPath, [join(here, "server.mjs")], {
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env, AVATAR_STANCES_DB: dbCopy },
  });

  const pending = new Map();
  let nextId = 1;
  const reader = createMessageReader((parsed) => {
    const message = parsed.message;
    if (message && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });
  server.stdout.on("data", (chunk) => reader.push(chunk));

  function request(method, params) {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, resolve);
      server.stdin.write(encodeMessage({ jsonrpc: "2.0", id, method, params }));
    });
  }

  async function tool(name, args) {
    const reply = await request("tools/call", { name, arguments: args });
    return {
      isError: reply.result?.isError ?? true,
      data: JSON.parse(reply.result?.content?.[0]?.text ?? "null"),
    };
  }

  function stop() {
    server.stdin.end();
    server.on("close", () => rmSync(workDir, { recursive: true, force: true }));
  }

  await request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: clientName, version: "0.1.0" },
  });

  return { request, tool, stop };
}

export const matches = matchTriggers;
