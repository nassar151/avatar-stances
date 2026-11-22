import { nextUniqueId, slugifyName } from "./ids.mjs";
import { avatarToColumns, rowToAvatar } from "./json-fields.mjs";
import { normalizeAvatarInput } from "./validate.mjs";

const INSERT_SQL = `
  INSERT INTO avatars (
    id, name, tagline, lens, voice, cares, ignores, triggers, needs, format, intensity, parent_id, created_at, updated_at
  ) VALUES (
    @id, @name, @tagline, @lens, @voice, @cares, @ignores, @triggers, @needs, @format, @intensity, @parent_id, @created_at, @updated_at
  )
`;

const UPDATE_SQL = `
  UPDATE avatars SET
    name = @name,
    tagline = @tagline,
    lens = @lens,
    voice = @voice,
    cares = @cares,
    ignores = @ignores,
    triggers = @triggers,
    needs = @needs,
    format = @format,
    intensity = @intensity,
    parent_id = @parent_id,
    updated_at = @updated_at
  WHERE id = @id
`;

function toFit(row) {
  return {
    id: row.id,
    name: row.name,
    triggers: rowToAvatar(row).triggers,
  };
}

export function listFit(db) {
  const rows = db
    .prepare("SELECT id, name, triggers FROM avatars WHERE parent_id IS NULL ORDER BY name COLLATE NOCASE")
    .all();
  return rows.map(toFit);
}

export function listChildrenFit(db, parentId) {
  const rows = db
    .prepare("SELECT id, name, triggers FROM avatars WHERE parent_id = ? ORDER BY name COLLATE NOCASE")
    .all(parentId);
  return rows.map(toFit);
}

export function listTree(db) {
  const generics = db
    .prepare("SELECT * FROM avatars WHERE parent_id IS NULL ORDER BY name COLLATE NOCASE")
    .all()
    .map(rowToAvatar);
  const children = db
    .prepare("SELECT * FROM avatars WHERE parent_id IS NOT NULL ORDER BY name COLLATE NOCASE")
    .all()
    .map(rowToAvatar);

  return generics.map((generic) => ({
    ...generic,
    children: children.filter((child) => child.parentId === generic.id),
  }));
}

function uniquePhrases(items) {
  const seen = new Set();
  const phrases = [];
  for (const item of items) {
    const key = String(item).toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    phrases.push(item);
  }
  return phrases;
}

function applySlice(avatar) {
  if (!avatar) {
    return null;
  }
  return {
    id: avatar.id,
    name: avatar.name,
    lens: avatar.lens,
    voice: avatar.voice,
    cares: avatar.cares,
    ignores: avatar.ignores,
    needs: avatar.needs,
    format: avatar.format,
    intensity: avatar.intensity,
  };
}

function mergeApplied(avatar, parent) {
  if (!parent) {
    return {
      lens: avatar.lens,
      voice: avatar.voice,
      cares: avatar.cares,
      ignores: avatar.ignores,
      needs: avatar.needs,
      format: avatar.format,
      intensity: avatar.intensity,
      overrides: [],
    };
  }
  const childCares = avatar.cares ?? [];
  const childIgnores = avatar.ignores ?? [];
  const caresOverride = overriddenBy(parent.cares, childIgnores);
  const ignoresOverride = overriddenBy(parent.ignores, childCares);

  return {
    lens: [parent.lens, avatar.lens].filter((part) => typeof part === "string" && part.length > 0).join("\n"),
    voice: [parent.voice, avatar.voice].filter((part) => typeof part === "string" && part.length > 0).join("\n"),
    cares: uniquePhrases([...caresOverride.kept, ...childCares]),
    ignores: uniquePhrases([...ignoresOverride.kept, ...childIgnores]),
    needs: uniquePhrases([...(avatar.needs ?? []), ...(parent.needs ?? [])]),
    format: avatar.format || parent.format || "",
    intensity: avatar.intensity,
    overrides: [
      ...caresOverride.dropped.map((item) => ({ item, parent: "cares", child: "ignores" })),
      ...ignoresOverride.dropped.map((item) => ({ item, parent: "ignores", child: "cares" })),
    ],
  };
}

function overriddenBy(parentItems, childOpposite) {
  const opposite = new Set(childOpposite.map((item) => String(item).toLowerCase()));
  const kept = [];
  const dropped = [];
  for (const item of parentItems ?? []) {
    (opposite.has(String(item).toLowerCase()) ? dropped : kept).push(item);
  }
  return { kept, dropped };
}

function loadRow(db, id) {
  return rowToAvatar(db.prepare("SELECT * FROM avatars WHERE id = ?").get(id));
}

export function getById(db, id) {
  const avatar = loadRow(db, id);
  if (!avatar) {
    return null;
  }
  if (!avatar.parentId) {
    return { ...avatar, parent: null, applied: mergeApplied(avatar, null) };
  }
  const parent = applySlice(loadRow(db, avatar.parentId));
  return { ...avatar, parent, applied: mergeApplied(avatar, parent) };
}

function existingIds(db) {
  return db.prepare("SELECT id FROM avatars").all().map((row) => row.id);
}

function resolveParentId(db, parentId) {
  if (!parentId) {
    return { parentId: null };
  }
  const parent = getById(db, parentId);
  if (!parent) {
    return { error: `Parent avatar not found: ${parentId}` };
  }
  if (parent.parentId) {
    return { error: "A child avatar cannot have children" };
  }
  return { parentId: parent.id };
}

export function createAvatar(db, input) {
  const { errors, avatar } = normalizeAvatarInput(input, { requireTriggers: true });
  if (errors.length > 0) {
    return { errors, avatar: null };
  }

  const parent = resolveParentId(db, avatar.parentId);
  if (parent.error) {
    return { errors: [parent.error], avatar: null };
  }

  const now = new Date().toISOString();
  const id = typeof input.id === "string" && input.id.trim()
    ? input.id.trim()
    : nextUniqueId(existingIds(db), slugifyName(avatar.name));

  if (getById(db, id)) {
    return { errors: [`id already exists: ${id}`], avatar: null };
  }

  const columns = avatarToColumns({ ...avatar, parentId: parent.parentId });
  db.prepare(INSERT_SQL).run({
    id,
    ...columns,
    created_at: now,
    updated_at: now,
  });

  return { errors: [], avatar: getById(db, id) };
}

export function updateAvatar(db, id, input) {
  const existing = getById(db, id);
  if (!existing) {
    return { errors: [`Avatar not found: ${id}`], avatar: null, notFound: true };
  }

  const { errors, avatar } = normalizeAvatarInput(input, { requireTriggers: true });
  if (errors.length > 0) {
    return { errors, avatar: null, notFound: false };
  }

  const parent = resolveParentId(db, avatar.parentId ?? existing.parentId);
  if (parent.error) {
    return { errors: [parent.error], avatar: null, notFound: false };
  }
  if (parent.parentId === id) {
    return { errors: ["An avatar cannot be its own parent"], avatar: null, notFound: false };
  }

  const now = new Date().toISOString();
  const columns = avatarToColumns({ ...avatar, parentId: existing.parentId });
  db.prepare(UPDATE_SQL).run({
    id,
    ...columns,
    updated_at: now,
  });

  return { errors: [], avatar: getById(db, id), notFound: false };
}

export function deleteAvatar(db, id) {
  const existing = getById(db, id);
  if (!existing) {
    return { deleted: false, notFound: true };
  }
  db.prepare("DELETE FROM avatars WHERE parent_id = ?").run(id);
  db.prepare("DELETE FROM avatars WHERE id = ?").run(id);
  return { deleted: true, notFound: false, avatar: existing };
}
