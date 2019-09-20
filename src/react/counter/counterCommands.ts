import { Command, NeonCommands } from 'neon2';

import { Counter } from './counterState';

const increment: Command<Counter> = {
  id: 'command.increment',
  name: 'Increment',
  keybinding: '=',
  canExecute: () => true,
  execute: context => {
    return {
      ...context.state,
      value: context.state.value + 1,
    };
  },
};

const decrement: Command<Counter> = {
  id: 'command.decrement',
  name: 'Decrement',
  keybinding: '-',
  canExecute: context => context.state.value > 0,
  execute: context => {
    return {
      ...context.state,
      value: context.state.value - 1,
    };
  },
};

export const CounterCommands = {
  increment,
  decrement,
  undo: NeonCommands.undo,
  redo: NeonCommands.redo,
};
