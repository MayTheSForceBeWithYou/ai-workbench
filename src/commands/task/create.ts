import { Command } from 'commander';
import { getDb } from '../../db/client.js';
import type { TaskType } from '../../lib/types.js';

const VALID_TYPES: TaskType[] = [
  'implementation', 'refactor', 'boilerplate',
  'architecture', 'debugging', 'docs', 'review', 'general',
];

export function taskCreateCommand(): Command {
  return new Command('create')
    .description('Create a new task')
    .requiredOption('-t, --title <title>', 'Task title')
    .option('-d, --description <desc>', 'Optional description')
    .option(
      '--type <type>',
      `Task type: ${VALID_TYPES.join(', ')}`,
      'general',
    )
    .action((opts: { title: string; description?: string; type: string }) => {
      if (!VALID_TYPES.includes(opts.type as TaskType)) {
        console.error(`Invalid type "${opts.type}". Valid: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
      }

      const db = getDb();
      const result = db
        .prepare('INSERT INTO tasks (title, description, task_type) VALUES (?, ?, ?)')
        .run(opts.title, opts.description ?? null, opts.type);

      console.log(`Created task #${result.lastInsertRowid}: ${opts.title}`);
    });
}
