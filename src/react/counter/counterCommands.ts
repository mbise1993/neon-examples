import { createCommand } from 'neon';

import { Counter } from './state';

export const CounterCommands = {
  increment: createCommand<Counter, {}>({
    id: 'command.increment',
    description: 'Increment the counter',
    keybinding: '=',
    execute: context => {
      return {
        ...context.state,
        value: context.state.value + 1,
      };
    },
  }),

  decrement: createCommand<Counter, {}>({
    id: 'command.decrement',
    description: 'Decrement the counter',
    keybinding: '-',
    canExecute: context => context.state.value > 0,
    execute: context => {
      return {
        ...context.state,
        value: context.state.value - 1,
      };
    },
  }),
};
