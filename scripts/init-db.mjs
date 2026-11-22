import { parseArgs } from "node:util";
import { addMissingSeeds, ensureSeeded, openDb, resetSeed } from "../lib/db.mjs";
import { DB_PATH } from "../lib/paths.mjs";

const { values } = parseArgs({
  options: {
    reset: { type: "boolean", default: false },
    "add-missing": { type: "boolean", default: false },
  },
});

function runInit(db) {
  if (values.reset) {
    return resetSeed(db);
  }
  if (values["add-missing"]) {
    return addMissingSeeds(db);
  }
  return ensureSeeded(db);
}

const db = openDb();
const result = runInit(db);
const { count } = db.prepare("SELECT COUNT(*) AS count FROM avatars").get();
const { generics } = db.prepare("SELECT COUNT(*) AS generics FROM avatars WHERE parent_id IS NULL").get();
db.close();

console.log(JSON.stringify({
  db: DB_PATH,
  seeded: result.seeded,
  reset: result.reset,
  added: result.added ?? 0,
  backfilled: result.backfilled,
  count,
  generics,
  children: count - generics,
}, null, 2));
