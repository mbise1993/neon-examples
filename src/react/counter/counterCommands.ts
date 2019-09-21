import { Command, NeonCommands } from 'react-neon';

import { Counter } from './counterState';

const increment: Command<Counter> = {
  id: 'command.increment',
  name: 'Increment',
  keybinding: '=',
  supportsUndo: true,
  requeryOnChange: [],
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
  supportsUndo: true,
  requeryOnChange: [state => state.value],
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
