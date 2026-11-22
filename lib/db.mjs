import { mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { CHILD_AVATARS } from "../db/seed-children.mjs";
import { EXTENDED_ROWS } from "../db/seed-extended/index.mjs";
import { guidanceFor } from "../db/seed-guidance.mjs";
import { SEED_AVATARS } from "../db/seed.mjs";
import { avatarToColumns, serializeJsonArray } from "./json-fields.mjs";
import { DATA_DIR, DB_PATH, SCHEMA_PATH } from "./paths.mjs";

const ADDED_COLUMNS = [
  { name: "parent_id", sql: "ALTER TABLE avatars ADD COLUMN parent_id TEXT" },
  { name: "needs", sql: "ALTER TABLE avatars ADD COLUMN needs TEXT NOT NULL DEFAULT '[]'" },
  { name: "format", sql: "ALTER TABLE avatars ADD COLUMN format TEXT NOT NULL DEFAULT ''" },
];

export const SEED_ROWS = [...SEED_AVATARS, ...CHILD_AVATARS, ...EXTENDED_ROWS];

export function openDb() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(readFileSync(SCHEMA_PATH, "utf8"));
  ensureColumns(db);
  return db;
}

function ensureColumns(db) {
  const existing = new Set(db.prepare("PRAGMA table_info(avatars)").all().map((column) => column.name));
  for (const column of ADDED_COLUMNS) {
    if (!existing.has(column.name)) {
      db.exec(column.sql);
    }
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_avatars_parent ON avatars(parent_id)");
}

export function withGuidance(seed) {
  const guidance = guidanceFor(seed.id);
  return {
    ...seed,
    needs: seed.needs ?? guidance.needs,
    format: seed.format ?? guidance.format,
    parentId: seed.parentId ?? null,
  };
}

function inTransaction(db, work) {
  db.exec("BEGIN");
  try {
    work();
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function insertSeedRows(db, { skipExisting } = { skipExisting: false }) {
  const now = new Date().toISOString();
  const verb = skipExisting ? "INSERT OR IGNORE" : "INSERT";
  const insert = db.prepare(`
    ${verb} INTO avatars (
      id, name, tagline, lens, voice, cares, ignores, triggers, needs, format, intensity, parent_id, created_at, updated_at
    ) VALUES (
      @id, @name, @tagline, @lens, @voice, @cares, @ignores, @triggers, @needs, @format, @intensity, @parent_id, @created_at, @updated_at
    )
  `);

  let inserted = 0;
  inTransaction(db, () => {
    for (const seed of SEED_ROWS) {
      const result = insert.run({
        id: seed.id,
        ...avatarToColumns(withGuidance(seed)),
        created_at: now,
        updated_at: now,
      });
      inserted += Number(result.changes);
    }
  });
  return inserted;
}

function backfillGuidance(db) {
  const update = db.prepare(`
    UPDATE avatars SET needs = @needs, format = @format
    WHERE id = @id AND needs = '[]' AND format = ''
  `);
  let filled = 0;
  inTransaction(db, () => {
    for (const seed of SEED_ROWS) {
      const { needs, format } = withGuidance(seed);
      const result = update.run({
        id: seed.id,
        needs: serializeJsonArray(needs),
        format,
      });
      filled += Number(result.changes);
    }
  });
  return filled;
}

export function addMissingSeeds(db) {
  const added = insertSeedRows(db, { skipExisting: true });
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM avatars").get();
  return { seeded: added > 0, reset: false, count, added, backfilled: backfillGuidance(db) };
}

export function ensureSeeded(db) {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM avatars").get();
  if (count > 0) {
    return { seeded: false, reset: false, count, backfilled: backfillGuidance(db) };
  }
  insertSeedRows(db);
  return { seeded: true, reset: false, count: SEED_ROWS.length, backfilled: 0 };
}

export function resetSeed(db) {
  db.exec("DELETE FROM avatars");
  insertSeedRows(db);
  return { seeded: true, reset: true, count: SEED_ROWS.length, backfilled: 0 };
}

export function openReadyDb() {
  const db = openDb();
  ensureSeeded(db);
  return db;
}
