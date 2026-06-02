export const SCHEMA = `
CREATE TABLE IF NOT EXISTS tools (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT,
  task_type   TEXT    NOT NULL DEFAULT 'general',
  status      TEXT    NOT NULL DEFAULT 'pending',
  tool_id     TEXT    REFERENCES tools(id),
  outcome     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  started_at  TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS usage_snapshots (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_id     TEXT NOT NULL REFERENCES tools(id),
  period      TEXT NOT NULL,
  tasks_done  INTEGER NOT NULL DEFAULT 0,
  notes       TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recommendations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id     INTEGER REFERENCES tasks(id),
  tool_id     TEXT NOT NULL REFERENCES tools(id),
  reason      TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const SEED_TOOLS = `
INSERT OR IGNORE INTO tools (id, name) VALUES
  ('chatgpt',        'ChatGPT Plus'),
  ('claude-code',    'Claude Code'),
  ('cursor',         'Cursor'),
  ('github-copilot', 'GitHub Copilot');
`;
