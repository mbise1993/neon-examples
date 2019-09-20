import uuid from 'uuid/v4';
import { AbstractModule, NeonContext } from 'neon2';
import { createModuleContext } from 'react-neon2';

import { CounterCommands } from './counterCommands';
import { Counter } from './counterState';

export class CounterModule extends AbstractModule<Counter> {
  public static readonly id = 'counter.module';

  constructor() {
    super(CounterModule.id, [...Object.values(CounterCommands)]);
    this.activateContext(this.createContext());
  }

  public createContext() {
    return new NeonContext<Counter>(`contexts.counter.${uuid()}`, { value: 0 });
  }
}

export const counterModule = new CounterModule();

export const CounterContext = createModuleContext(counterModule);
