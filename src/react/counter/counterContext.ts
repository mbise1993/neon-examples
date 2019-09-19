import { NeonContext, NeonCommands } from 'neon';
import { createNeonContext } from 'react-neon';

import { Counter } from './state';
import { CounterCommands } from './counterCommands';

export const counterContext = new NeonContext<Counter>('context.counter', { value: 0 });
counterContext.handleCommands(
  CounterCommands.increment,
  CounterCommands.decrement,
  NeonCommands.undo,
  NeonCommands.redo,
);

export const CounterContext = createNeonContext(counterContext);
