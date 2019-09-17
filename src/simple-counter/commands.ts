import { Command, DomainContext } from 'neon';

import { Counter } from './state';

export class IncrementCommand extends Command<Counter, {}> {
  public static readonly id = 'command.increment';
  public static readonly description = 'Increment the counter';

  public execute(context: DomainContext<Counter>): Counter {
    const counter = context.getState();
    return {
      ...counter,
      value: counter.value + 1,
    };
  }
}

export class DecrementCommand extends Command<Counter, {}> {
  public static readonly id = 'command.decrement';
  public static readonly description = 'Decrement the counter';

  public canExecute(context: DomainContext<Counter>) {
    return context.getState().value > 0;
  }

  public execute(context: DomainContext<Counter>): Counter {
    const counter = context.getState();
    return {
      ...counter,
      value: counter.value - 1,
    };
  }
}
