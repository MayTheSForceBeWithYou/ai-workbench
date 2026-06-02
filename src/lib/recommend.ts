import type { TaskType, ToolId } from './types.js';

interface Recommendation {
  tool: ToolId;
  reason: string;
}

const ROUTING: Record<TaskType, Recommendation> = {
  implementation: {
    tool: 'claude-code',
    reason: 'Multi-file repo implementation — Claude Code handles broad context and cross-file edits best.',
  },
  refactor: {
    tool: 'cursor',
    reason: 'In-editor refactor — Cursor\'s agent mode works inline with your open files.',
  },
  boilerplate: {
    tool: 'github-copilot',
    reason: 'Boilerplate generation — Copilot\'s inline completions are fast for repetitive scaffolding.',
  },
  architecture: {
    tool: 'chatgpt',
    reason: 'Architecture planning — ChatGPT excels at high-level design discussion and tradeoff analysis.',
  },
  debugging: {
    tool: 'chatgpt',
    reason: 'Debugging strategy — ChatGPT is strong at reasoning through error chains and proposing hypotheses.',
  },
  docs: {
    tool: 'chatgpt',
    reason: 'Documentation — ChatGPT produces well-structured prose and can adapt tone for different audiences.',
  },
  review: {
    tool: 'chatgpt',
    reason: 'Code review — ChatGPT provides thorough review commentary and catches logical issues.',
  },
  general: {
    tool: 'claude-code',
    reason: 'General coding task — defaulting to Claude Code for broad capability.',
  },
};

export function recommend(taskType: TaskType): Recommendation {
  return ROUTING[taskType] ?? ROUTING.general;
}

export function allRecommendations(): Array<{ taskType: TaskType } & Recommendation> {
  return (Object.entries(ROUTING) as [TaskType, Recommendation][]).map(
    ([taskType, rec]) => ({ taskType, ...rec }),
  );
}
