import { Command } from 'commander';
import { getDb } from '../../db/client.js';

export function taskDeleteCommand(): Command {
  return new Command('delete')
    .description('Delete a task')
    .requiredOption('--id <id>', 'Task id', parseInt)
    .action((opts: { id: number }) => {
      if (!Number.isInteger(opts.id) || opts.id < 1) {
        console.error('--id must be a positive integer');
        process.exit(1);
      }

      const db = getDb();
      const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(opts.id);

      if (!result.changes) {
        console.error(`Task #${opts.id} not found.`);
        process.exit(1);
      }

      console.log(`Deleted task #${opts.id}`);
    });
}
