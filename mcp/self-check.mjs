import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createMessageReader, encodeMessage } from "./stdio.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const replies = [];

const child = spawn(process.execPath, [join(here, "server.mjs")], {
  stdio: ["pipe", "pipe", "inherit"],
});

const reader = createMessageReader((parsed) => {
  if (parsed.message) {
    replies.push(parsed.message);
  }
});

child.stdout.on("data", (chunk) => reader.push(chunk));

function request(id, method, params) {
  child.stdin.write(encodeMessage({ jsonrpc: "2.0", id, method, params }));
}

request(1, "initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "self-check", version: "0.1.0" },
});
request(2, "tools/list", {});
request(3, "tools/call", { name: "list_avatars", arguments: {} });
request(4, "tools/call", { name: "list_child_avatars", arguments: { parentId: "doctor" } });
request(5, "tools/call", { name: "get_avatar", arguments: { id: "cardiologist" } });
child.stdin.end();

function payload(reply) {
  return JSON.parse(reply?.result?.content?.[0]?.text ?? "null");
}

function listedId(rows, id) {
  return Array.isArray(rows) && rows.some((row) => row.id === id);
}

child.on("close", () => {
  const names = replies[1]?.result?.tools?.map((tool) => tool.name) ?? [];
  const generics = payload(replies[2]);
  const children = payload(replies[3]);
  const cardiologist = payload(replies[4]);
  const getText = JSON.stringify(cardiologist ?? {});
  const result = {
    replyCount: replies.length,
    toolNames: names,
    listedDoctor: listedId(generics, "doctor"),
    listedCardiologistAtGeneric: listedId(generics, "cardiologist"),
    listedCardiologistAsChild: listedId(children, "cardiologist"),
    loadedCardiologist: getText.includes("ischemia"),
    mergedDoctorCares: cardiologist?.applied?.cares?.some((item) => item.includes("red flags")) ?? false,
    includedDoctorParent: cardiologist?.parent?.name === "Doctor",
  };
  const ok = (
    replies.length >= 5
    && names.includes("list_child_avatars")
    && result.listedDoctor
    && !result.listedCardiologistAtGeneric
    && result.listedCardiologistAsChild
    && result.loadedCardiologist
    && result.mergedDoctorCares
    && result.includedDoctorParent
  );
  console.log(JSON.stringify(result, null, 2));
  process.exit(ok ? 0 : 1);
});
