import { Command } from 'commander';
import { getDb } from '../../db/client.js';

export function taskFinishCommand(): Command {
  return new Command('finish')
    .description('Mark a task as done')
    .requiredOption('--id <id>', 'Task id', parseInt)
    .requiredOption('--outcome <outcome>', 'What was accomplished')
    .action((opts: { id: number; outcome: string }) => {
      const db = getDb();
      const result = db
        .prepare(
          `UPDATE tasks
           SET status = 'done', outcome = ?, finished_at = datetime('now')
           WHERE id = ? AND status = 'in_progress'`,
        )
        .run(opts.outcome, opts.id);

      if (!result.changes) {
        console.error(`Task #${opts.id} not found or not in 'in_progress' status.`);
        process.exit(1);
      }

      console.log(`Finished task #${opts.id}: ${opts.outcome}`);
    });
}
