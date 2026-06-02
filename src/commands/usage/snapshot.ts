import { Command } from 'commander';
import { getDb } from '../../db/client.js';
import { formatSnapshot } from '../../lib/format.js';
import type { ToolId, UsageSnapshot } from '../../lib/types.js';

const VALID_TOOLS: ToolId[] = ['chatgpt', 'claude-code', 'cursor', 'github-copilot'];

export function usageSnapshotCommand(): Command {
  return new Command('snapshot')
    .description('Record or list manual usage snapshots')
    .option('--record', 'Record a new snapshot')
    .option('--tool <tool>', `Tool id: ${VALID_TOOLS.join(', ')}`)
    .option('--period <period>', 'Time period label, e.g. "2024-06-W1"')
    .option('--tasks <n>', 'Number of tasks completed in this period', parseInt)
    .option('--notes <notes>', 'Optional notes')
    .action(
      (opts: {
        record?: boolean;
        tool?: string;
        period?: string;
        tasks?: number;
        notes?: string;
      }) => {
        const db = getDb();

        if (opts.record) {
          if (!opts.tool || !opts.period || opts.tasks === undefined) {
            console.error('--tool, --period, and --tasks are required when recording.');
            process.exit(1);
          }
          if (!VALID_TOOLS.includes(opts.tool as ToolId)) {
            console.error(`Invalid tool. Valid: ${VALID_TOOLS.join(', ')}`);
            process.exit(1);
          }

          const result = db
            .prepare(
              'INSERT INTO usage_snapshots (tool_id, period, tasks_done, notes) VALUES (?, ?, ?, ?)',
            )
            .run(opts.tool, opts.period, opts.tasks, opts.notes ?? null);

          console.log(`Recorded snapshot #${result.lastInsertRowid} for ${opts.tool} / ${opts.period}`);
          return;
        }

        const snapshots = db
          .prepare('SELECT * FROM usage_snapshots ORDER BY recorded_at DESC LIMIT 50')
          .all() as UsageSnapshot[];

        if (snapshots.length === 0) {
          console.log('No snapshots recorded yet. Use --record to add one.');
          return;
        }

        snapshots.forEach((s) => console.log(formatSnapshot(s)));
      },
    );
}
