import {
  createAvatar,
  deleteAvatar,
  getById,
  listTree,
  updateAvatar,
} from "../lib/avatars.mjs";
import { readJsonBody, sendError, sendJson } from "./http.mjs";

const COLLECTION = "/api/avatars";
const ITEM_PREFIX = "/api/avatars/";

function itemId(pathname) {
  if (!pathname.startsWith(ITEM_PREFIX)) {
    return null;
  }
  const id = pathname.slice(ITEM_PREFIX.length);
  if (id.length === 0 || id.includes("/")) {
    return null;
  }
  return decodeURIComponent(id);
}

export async function handleApi(req, res, db, pathname) {
  if (pathname === COLLECTION && req.method === "GET") {
    sendJson(res, 200, listTree(db));
    return true;
  }

  if (pathname === COLLECTION && req.method === "POST") {
    const body = await readJsonBody(req);
    const result = createAvatar(db, body);
    if (result.errors.length > 0) {
      sendJson(res, 400, { errors: result.errors });
      return true;
    }
    sendJson(res, 201, result.avatar);
    return true;
  }

  const id = itemId(pathname);
  if (!id) {
    return false;
  }

  if (req.method === "GET") {
    const avatar = getById(db, id);
    if (!avatar) {
      sendError(res, 404, `Avatar not found: ${id}`);
      return true;
    }
    sendJson(res, 200, avatar);
    return true;
  }

  if (req.method === "PUT") {
    const body = await readJsonBody(req);
    const result = updateAvatar(db, id, body);
    if (result.notFound) {
      sendError(res, 404, result.errors[0]);
      return true;
    }
    if (result.errors.length > 0) {
      sendJson(res, 400, { errors: result.errors });
      return true;
    }
    sendJson(res, 200, result.avatar);
    return true;
  }

  if (req.method === "DELETE") {
    const result = deleteAvatar(db, id);
    if (result.notFound) {
      sendError(res, 404, `Avatar not found: ${id}`);
      return true;
    }
    sendJson(res, 200, { deleted: true, id });
    return true;
  }

  return false;
}
