import { CommandConfig } from './interfaces';

const undo: CommandConfig<any> = {
  info: {
    id: 'neon.commands.undo',
    name: 'Undo',
    description: 'Undo',
    keybinding: 'Meta+z',
  },
  command: {
    requeryAfter: [state => state],
    canExecute: _context => true,
    execute: context => context.state,
  },
};

const redo: CommandConfig<any> = {
  info: {
    id: 'neon.commands.redo',
    name: 'Redo',
    description: 'Redo',
    keybinding: 'Meta+Shift+z',
  },
  command: {
    requeryAfter: [state => state],
    canExecute: _context => true,
    execute: context => context.state,
  },
};

export const NeonCommands = {
  undo,
  redo,
};
