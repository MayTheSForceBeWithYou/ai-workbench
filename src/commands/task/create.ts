import { Command } from 'commander';
import { getDb } from '../../db/client.js';
import type { TaskType, ToolId } from '../../lib/types.js';

const VALID_TYPES: TaskType[] = [
  'implementation', 'refactor', 'boilerplate',
  'architecture', 'debugging', 'docs', 'review', 'general',
];

export const VALID_TOOLS: ToolId[] = [
  'chatgpt', 'claude-code', 'cursor', 'github-copilot', 'manual', 'other',
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
    .option(
      '--tool <tool>',
      `AI tool used: ${VALID_TOOLS.join(', ')}`,
    )
    .option('--outcome <outcome>', 'Outcome or result of the task')
    .action((opts: { title: string; description?: string; type: string; tool?: string; outcome?: string }) => {
      if (!VALID_TYPES.includes(opts.type as TaskType)) {
        console.error(`Invalid type "${opts.type}". Valid: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
      }

      if (opts.tool && !VALID_TOOLS.includes(opts.tool as ToolId)) {
        console.error(`Invalid tool "${opts.tool}". Valid: ${VALID_TOOLS.join(', ')}`);
        process.exit(1);
      }

      const db = getDb();
      const result = db
        .prepare(
          'INSERT INTO tasks (title, description, task_type, tool_id, outcome) VALUES (?, ?, ?, ?, ?)',
        )
        .run(
          opts.title,
          opts.description ?? null,
          opts.type,
          opts.tool ?? null,
          opts.outcome ?? null,
        );

      console.log(`Created task #${result.lastInsertRowid}: ${opts.title}`);
    });
}
