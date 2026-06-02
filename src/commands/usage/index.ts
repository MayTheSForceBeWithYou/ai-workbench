import { Command } from 'commander';
import { usageSnapshotCommand } from './snapshot.js';

export function usageCommand(): Command {
  const cmd = new Command('usage').description('Track AI tool usage manually');
  cmd.addCommand(usageSnapshotCommand());
  return cmd;
}
