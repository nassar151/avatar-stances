import { JSON_ARRAY_FIELDS } from "./constants.mjs";

export function parseJsonArray(raw) {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item)).filter((item) => item.length > 0);
  }

  if (typeof raw !== "string" || raw.trim() === "") {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => String(item)).filter((item) => item.length > 0);
  } catch {
    return [];
  }
}

export function serializeJsonArray(value) {
  const items = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter((item) => item.length > 0)
    : [];
  return JSON.stringify(items);
}

export function rowToAvatar(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    lens: row.lens,
    voice: row.voice,
    cares: parseJsonArray(row.cares),
    ignores: parseJsonArray(row.ignores),
    triggers: parseJsonArray(row.triggers),
    needs: parseJsonArray(row.needs),
    format: row.format ?? "",
    intensity: Number(row.intensity),
    parentId: row.parent_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function avatarToColumns(avatar) {
  const columns = {
    name: avatar.name,
    tagline: avatar.tagline ?? "",
    lens: avatar.lens ?? "",
    voice: avatar.voice ?? "",
    format: avatar.format ?? "",
    intensity: avatar.intensity,
    parent_id: avatar.parentId ?? null,
    cares: serializeJsonArray(avatar.cares),
    ignores: serializeJsonArray(avatar.ignores),
    triggers: serializeJsonArray(avatar.triggers),
    needs: serializeJsonArray(avatar.needs),
  };

  for (const field of JSON_ARRAY_FIELDS) {
    if (typeof columns[field] !== "string") {
      columns[field] = "[]";
    }
  }

  return columns;
}
