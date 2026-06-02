import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { SCHEMA, SEED_TOOLS } from './schema.js';

const DATA_DIR = join(homedir(), '.ai-workbench');
const DB_PATH = join(DATA_DIR, 'workbench.db');

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (_db) return _db;

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  _db = new DatabaseSync(DB_PATH);
  _db.exec('PRAGMA journal_mode = WAL');
  _db.exec('PRAGMA foreign_keys = ON');
  _db.exec(SCHEMA);
  _db.exec(SEED_TOOLS);

  return _db;
}

export function closeDb(): void {
  _db?.close();
  _db = null;
}
