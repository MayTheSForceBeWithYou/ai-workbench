import { Command } from 'commander';
import { allRecommendations, recommend } from '../lib/recommend.js';
import type { TaskType } from '../lib/types.js';

const VALID_TYPES: TaskType[] = [
  'implementation', 'refactor', 'boilerplate',
  'architecture', 'debugging', 'docs', 'review', 'general',
];

export function recommendCommand(): Command {
  return new Command('recommend')
    .description('Recommend which tool to use for a task type')
    .option(
      '--type <type>',
      `Task type: ${VALID_TYPES.join(', ')}. Omit to see all routing rules.`,
    )
    .action((opts: { type?: string }) => {
      if (!opts.type) {
        console.log('Tool routing rules:\n');
        allRecommendations().forEach(({ taskType, tool, reason }) => {
          console.log(`  ${taskType.padEnd(16)} → ${tool}`);
          console.log(`                     ${reason}\n`);
        });
        return;
      }

      if (!VALID_TYPES.includes(opts.type as TaskType)) {
        console.error(`Invalid type "${opts.type}". Valid: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
      }

      const { tool, reason } = recommend(opts.type as TaskType);
      console.log(`Recommended tool: ${tool}`);
      console.log(`Reason: ${reason}`);
    });
}
