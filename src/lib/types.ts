export type ToolId = 'chatgpt' | 'claude-code' | 'cursor' | 'github-copilot';

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'abandoned';

export type TaskType =
  | 'implementation'
  | 'refactor'
  | 'boilerplate'
  | 'architecture'
  | 'debugging'
  | 'docs'
  | 'review'
  | 'general';

export interface Tool {
  id: ToolId;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  task_type: TaskType;
  status: TaskStatus;
  tool_id: ToolId | null;
  outcome: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface UsageSnapshot {
  id: number;
  tool_id: ToolId;
  period: string;
  tasks_done: number;
  notes: string | null;
  recorded_at: string;
}

export interface Recommendation {
  id: number;
  task_id: number | null;
  tool_id: ToolId;
  reason: string;
  created_at: string;
}
