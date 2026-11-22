import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT_DIR = fileURLToPath(new URL("..", import.meta.url));
export const DB_PATH = process.env.AVATAR_STANCES_DB ?? join(ROOT_DIR, "data", "avatars.sqlite");
export const DATA_DIR = dirname(DB_PATH);
export const SCHEMA_PATH = join(ROOT_DIR, "db", "schema.sql");
