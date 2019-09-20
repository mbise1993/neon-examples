import { Command } from './command';

const undo: Command<any> = {
  id: 'neon.commands.undo',
  name: 'Undo',
  description: 'Undo',
  keybinding: 'Meta+z',
  canExecute: () => true,
  execute: context => context.state,
};

const redo: Command<any> = {
  id: 'neon.commands.redo',
  name: 'Redo',
  description: 'Redo',
  keybinding: 'Meta+Shift+z',
  canExecute: () => true,
  execute: context => context.state,
};

export const NeonCommands = {
  undo,
  redo,
};
