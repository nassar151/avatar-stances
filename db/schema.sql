CREATE TABLE IF NOT EXISTS avatars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  lens TEXT NOT NULL DEFAULT '',
  voice TEXT NOT NULL DEFAULT '',
  cares TEXT NOT NULL DEFAULT '[]',
  ignores TEXT NOT NULL DEFAULT '[]',
  triggers TEXT NOT NULL DEFAULT '[]',
  needs TEXT NOT NULL DEFAULT '[]',
  format TEXT NOT NULL DEFAULT '',
  intensity REAL NOT NULL DEFAULT 0.7,
  parent_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
