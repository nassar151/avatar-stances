import { openReadyDb } from "../lib/db.mjs";
import {
  JSONRPC_INTERNAL_ERROR,
  JSONRPC_INVALID_REQUEST,
  JSONRPC_METHOD_NOT_FOUND,
  JSONRPC_PARSE_ERROR,
  METHOD_INITIALIZE,
  METHOD_INITIALIZED,
  METHOD_PING,
  METHOD_TOOLS_CALL,
  METHOD_TOOLS_LIST,
  NOTIFY_TOOLS_LIST_CHANGED,
  PROTOCOL_VERSION,
  SERVER_NAME,
  SERVER_VERSION,
} from "./constants.mjs";
import { createMessageReader, encodeMessage } from "./stdio.mjs";
import { TOOL_DEFINITIONS, callTool } from "./tools.mjs";

if (process.stdout._handle?.setBlocking) {
  process.stdout._handle.setBlocking(true);
}

let db;

function getDb() {
  if (!db) {
    db = openReadyDb();
  }
  return db;
}

function send(message) {
  process.stdout.write(encodeMessage(message));
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function handleInitialize(id, params) {
  const requested = params?.protocolVersion;
  const protocolVersion = typeof requested === "string" && requested.length > 0
    ? requested
    : PROTOCOL_VERSION;
  sendResult(id, {
    protocolVersion,
    capabilities: { tools: { listChanged: true } },
    serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
  });
}

function handleToolsList(id) {
  sendResult(id, { tools: TOOL_DEFINITIONS });
}

function handleToolsCall(id, params) {
  const name = params?.name;
  if (typeof name !== "string" || name.length === 0) {
    sendError(id, JSONRPC_INVALID_REQUEST, "tools/call requires name");
    return;
  }
  const result = callTool(getDb(), name, params.arguments);
  sendResult(id, {
    content: [{ type: "text", text: JSON.stringify(result.payload) }],
    isError: result.isError,
  });
}

const REQUEST_HANDLERS = {
  [METHOD_INITIALIZE]: handleInitialize,
  [METHOD_TOOLS_LIST]: handleToolsList,
  [METHOD_TOOLS_CALL]: handleToolsCall,
  [METHOD_PING]: (id) => sendResult(id, {}),
};

function handleMessage(parsed) {
  if (parsed.skip) {
    return;
  }
  if (parsed.error) {
    sendError(null, JSONRPC_PARSE_ERROR, parsed.error);
    return;
  }

  const message = parsed.message;
  if (message === null || typeof message !== "object" || Array.isArray(message)) {
    sendError(null, JSONRPC_INVALID_REQUEST, "Invalid request");
    return;
  }

  const { id, method, params } = message;
  if (typeof method !== "string") {
    sendError(id ?? null, JSONRPC_INVALID_REQUEST, "Missing method");
    return;
  }

  if (id === undefined) {
    if (method === METHOD_INITIALIZED) {
      send({ jsonrpc: "2.0", method: NOTIFY_TOOLS_LIST_CHANGED });
    }
    return;
  }

  const handler = REQUEST_HANDLERS[method];
  if (!handler) {
    sendError(id, JSONRPC_METHOD_NOT_FOUND, `Method not found: ${method}`);
    return;
  }

  try {
    handler(id, params);
  } catch (error) {
    sendError(id, JSONRPC_INTERNAL_ERROR, error.message ?? "Internal error");
  }
}

const reader = createMessageReader(handleMessage);
process.stdin.on("data", (chunk) => reader.push(chunk));
process.stdin.on("end", () => {
  db?.close();
});
process.stdin.resume();
process.stderr.write("avatar-stances mcp ready\n");
