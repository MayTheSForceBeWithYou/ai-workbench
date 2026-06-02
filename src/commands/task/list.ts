import { Command } from 'commander';
import { getDb } from '../../db/client.js';
import { formatTask } from '../../lib/format.js';
import type { Task } from '../../lib/types.js';

export function taskListCommand(): Command {
  return new Command('list')
    .description('List tasks')
    .option('--status <status>', 'Filter by status: pending, in_progress, done, abandoned')
    .option('--tool <tool>', 'Filter by tool id')
    .action((opts: { status?: string; tool?: string }) => {
      const db = getDb();
      const conditions: string[] = [];
      const params: string[] = [];

      if (opts.status) {
        conditions.push('status = ?');
        params.push(opts.status);
      }
      if (opts.tool) {
        conditions.push('tool_id = ?');
        params.push(opts.tool);
      }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      const tasks = db
        .prepare(`SELECT * FROM tasks ${where} ORDER BY id DESC`)
        .all(...params) as unknown as Task[];

      if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
      }

      tasks.forEach((t) => console.log(formatTask(t), '\n'));
    });
}
