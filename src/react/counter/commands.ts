import { createCommand } from 'neon';

import { Counter } from './state';

export const incrementCommand = createCommand<Counter, {}>({
  id: 'command.increment',
  description: 'Increment the counter',
  execute: context => {
    return {
      ...context.state,
      value: context.state.value + 1,
    };
  },
});

export const decrementCommand = createCommand<Counter, {}>({
  id: 'command.decrement',
  description: 'Decrement the counter',
  canExecute: context => context.state.value > 0,
  execute: context => {
    return {
      ...context.state,
      value: context.state.value - 1,
    };
  },
});
