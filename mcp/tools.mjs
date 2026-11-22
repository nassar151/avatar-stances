import { createAvatar, getById, listChildrenFit, listFit } from "../lib/avatars.mjs";
import {
  TOOL_CREATE_AVATAR,
  TOOL_GET_AVATAR,
  TOOL_LIST_AVATARS,
  TOOL_LIST_CHILD_AVATARS,
} from "./constants.mjs";

const STRING_ARRAY = {
  type: "array",
  items: { type: "string" },
};

export const TOOL_DEFINITIONS = [
  {
    name: TOOL_LIST_AVATARS,
    description:
      "Step 1. List generic (parent) avatars only: id, name, triggers. Compare the user request to each generic's triggers by meaning, not by shared words: a trigger matches when the request is about what it describes, even in other words (\"my tummy aches and I keep throwing up\" matches Doctor's symptom triggers). Pick the generic whose triggers relate most strongly to the request, then call list_child_avatars with its id.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: TOOL_LIST_CHILD_AVATARS,
    description:
      "Step 2. List the children of the chosen generic: id, name, triggers. Compare the request to each child's triggers by meaning, the same way. If a child's specialty fits, get_avatar with the child id; if none fits, get_avatar with the generic id.",
    inputSchema: {
      type: "object",
      properties: {
        parentId: {
          type: "string",
          description: "Generic avatar id from list_avatars",
        },
      },
      required: ["parentId"],
    },
  },
  {
    name: TOOL_GET_AVATAR,
    description:
      "Load one full avatar row by id (generic or child). A child includes parent (generic apply fields) and applied (parent merged with child). Answer from applied: ask about a missing applied.needs fact first, then answer in applied.format. On any conflict between parent and child the child wins; applied.overrides lists parent items already dropped for that reason.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Avatar id from list_avatars or list_child_avatars",
        },
      },
      required: ["id"],
    },
  },
  {
    name: TOOL_CREATE_AVATAR,
    description:
      "Insert a new generic avatar when no generic relates to the request. Optional parentId creates a child under that generic. Then answer as the returned row in the same turn.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        tagline: { type: "string" },
        lens: { type: "string" },
        voice: { type: "string" },
        cares: STRING_ARRAY,
        ignores: STRING_ARRAY,
        triggers: STRING_ARRAY,
        needs: {
          ...STRING_ARRAY,
          description: "Facts the answer depends on. If one that matters is missing, ask one short question first.",
        },
        format: {
          type: "string",
          description: "Shape of the answer: order of sections, lists vs prose, code blocks, length.",
        },
        intensity: { type: "number", minimum: 0, maximum: 1 },
        parentId: { type: "string" },
      },
      required: ["name", "triggers", "intensity"],
    },
  },
];

const TOOL_HANDLERS = {
  [TOOL_LIST_AVATARS]: handleListAvatars,
  [TOOL_LIST_CHILD_AVATARS]: handleListChildAvatars,
  [TOOL_GET_AVATAR]: handleGetAvatar,
  [TOOL_CREATE_AVATAR]: handleCreateAvatar,
};

export function callTool(db, name, args) {
  const handler = TOOL_HANDLERS[name];
  if (!handler) {
    return {
      isError: true,
      payload: { error: `Unknown tool: ${name}` },
    };
  }
  return handler(db, args ?? {});
}

function handleListAvatars(db) {
  return { isError: false, payload: listFit(db) };
}

function handleListChildAvatars(db, args) {
  const parentId = typeof args.parentId === "string" ? args.parentId.trim() : "";
  if (parentId.length === 0) {
    return { isError: true, payload: { error: "parentId is required" } };
  }
  const parent = getById(db, parentId);
  if (!parent) {
    return { isError: true, payload: { error: `Parent avatar not found: ${parentId}` } };
  }
  if (parent.parentId) {
    return { isError: true, payload: { error: "A child avatar cannot have children" } };
  }
  return { isError: false, payload: listChildrenFit(db, parentId) };
}

function handleGetAvatar(db, args) {
  const id = typeof args.id === "string" ? args.id.trim() : "";
  if (id.length === 0) {
    return { isError: true, payload: { error: "id is required" } };
  }
  const avatar = getById(db, id);
  if (!avatar) {
    return { isError: true, payload: { error: `Avatar not found: ${id}` } };
  }
  return { isError: false, payload: avatar };
}

function handleCreateAvatar(db, args) {
  const result = createAvatar(db, args);
  if (result.errors.length > 0) {
    return { isError: true, payload: { errors: result.errors } };
  }
  return { isError: false, payload: result.avatar };
}
