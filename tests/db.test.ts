import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SCHEMA, SEED_TOOLS } from '../src/db/schema.js';
import type { Task, Tool } from '../src/lib/types.js';

let db: DatabaseSync;

beforeEach(() => {
  db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  db.exec(SEED_TOOLS);
});

afterEach(() => {
  db.close();
});

describe('schema', () => {
  it('seeds all four tools', () => {
    const tools = db.prepare('SELECT * FROM tools').all() as Tool[];
    expect(tools.map((t) => t.id)).toEqual([
      'chatgpt',
      'claude-code',
      'cursor',
      'github-copilot',
    ]);
  });

  it('creates a task and retrieves it', () => {
    db.prepare('INSERT INTO tasks (title, task_type) VALUES (?, ?)').run(
      'Scaffold auth module',
      'implementation',
    );
    const task = db.prepare('SELECT * FROM tasks').get() as Task;
    expect(task.title).toBe('Scaffold auth module');
    expect(task.status).toBe('pending');
    expect(task.task_type).toBe('implementation');
  });

  it('transitions task through pending → in_progress → done', () => {
    db.prepare('INSERT INTO tasks (title, task_type) VALUES (?, ?)').run(
      'Write tests',
      'general',
    );
    const row = db.prepare('SELECT id FROM tasks').get() as { id: number };

    db.prepare(
      "UPDATE tasks SET status='in_progress', tool_id='claude-code', started_at=datetime('now') WHERE id=?",
    ).run(row.id);

    db.prepare(
      "UPDATE tasks SET status='done', outcome='tests written', finished_at=datetime('now') WHERE id=?",
    ).run(row.id);

    const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(row.id) as Task;
    expect(task.status).toBe('done');
    expect(task.tool_id).toBe('claude-code');
    expect(task.outcome).toBe('tests written');
    expect(task.finished_at).not.toBeNull();
  });

  it('records a usage snapshot', () => {
    db.prepare(
      "INSERT INTO usage_snapshots (tool_id, period, tasks_done) VALUES ('cursor', '2024-06-W1', 5)",
    ).run();

    const row = db
      .prepare('SELECT tool_id, tasks_done FROM usage_snapshots')
      .get() as { tool_id: string; tasks_done: number };

    expect(row.tool_id).toBe('cursor');
    expect(row.tasks_done).toBe(5);
  });
});
