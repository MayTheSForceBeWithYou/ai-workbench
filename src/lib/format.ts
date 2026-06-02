import type { Task, UsageSnapshot } from './types.js';

export function formatTask(t: Task): string {
  const tool = t.tool_id ? `  tool:    ${t.tool_id}` : '';
  const outcome = t.outcome ? `  outcome: ${t.outcome}` : '';
  return [
    `[${t.id}] ${t.title}`,
    `  status:  ${t.status}  type: ${t.task_type}`,
    tool,
    outcome,
    `  created: ${t.created_at}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatSnapshot(s: UsageSnapshot): string {
  return `[${s.id}] ${s.tool_id}  period: ${s.period}  tasks: ${s.tasks_done}${s.notes ? `  notes: ${s.notes}` : ''}`;
}
