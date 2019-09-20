import { Command } from './command';

const undo: Command<any> = {
  id: 'neon.commands.undo',
  name: 'Undo',
  description: 'Undo',
  keybinding: 'Meta+z',
  requeryOnChange: [state => state],
  canExecute: context => context.history.hasPastFrames(),
  execute: context => context.history.goBack(1),
};

const redo: Command<any> = {
  id: 'neon.commands.redo',
  name: 'Redo',
  description: 'Redo',
  keybinding: 'Meta+Shift+z',
  requeryOnChange: [state => state],
  canExecute: context => context.history.hasFutureFrames(),
  execute: context => context.history.goForward(1),
};

export const NeonCommands = {
  undo,
  redo,
};
