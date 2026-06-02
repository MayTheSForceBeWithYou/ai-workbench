#!/usr/bin/env node
import { Command } from 'commander';
import { taskCommand } from './commands/task/index.js';
import { usageCommand } from './commands/usage/index.js';
import { recommendCommand } from './commands/recommend.js';

const program = new Command();

program
  .name('aiw')
  .description('AI Workbench — track and optimize your AI coding tool usage')
  .version('0.1.0');

program.addCommand(taskCommand());
program.addCommand(usageCommand());
program.addCommand(recommendCommand());

program.parse(process.argv);
