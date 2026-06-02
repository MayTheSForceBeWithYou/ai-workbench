import { Command } from 'commander';
import { getDb } from '../../db/client.js';
import type { ToolId } from '../../lib/types.js';

const VALID_TOOLS: ToolId[] = ['chatgpt', 'claude-code', 'cursor', 'github-copilot'];

export function taskStartCommand(): Command {
  return new Command('start')
    .description('Mark a task as in-progress with the chosen tool')
    .requiredOption('--id <id>', 'Task id', parseInt)
    .requiredOption('--tool <tool>', `Tool to use: ${VALID_TOOLS.join(', ')}`)
    .action((opts: { id: number; tool: string }) => {
      if (!VALID_TOOLS.includes(opts.tool as ToolId)) {
        console.error(`Invalid tool "${opts.tool}". Valid: ${VALID_TOOLS.join(', ')}`);
        process.exit(1);
      }

      const db = getDb();
      const result = db
        .prepare(
          `UPDATE tasks
           SET status = 'in_progress', tool_id = ?, started_at = datetime('now')
           WHERE id = ? AND status = 'pending'`,
        )
        .run(opts.tool, opts.id);

      if (!result.changes) {
        console.error(`Task #${opts.id} not found or not in 'pending' status.`);
        process.exit(1);
      }

      console.log(`Started task #${opts.id} with ${opts.tool}`);
    });
}
