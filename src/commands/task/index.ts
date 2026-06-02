import { Command } from 'commander';
import { taskCreateCommand } from './create.js';
import { taskFinishCommand } from './finish.js';
import { taskListCommand } from './list.js';
import { taskStartCommand } from './start.js';

export function taskCommand(): Command {
  const cmd = new Command('task').description('Manage coding tasks');
  cmd.addCommand(taskCreateCommand());
  cmd.addCommand(taskListCommand());
  cmd.addCommand(taskStartCommand());
  cmd.addCommand(taskFinishCommand());
  return cmd;
}
