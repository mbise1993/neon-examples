import { DomainContext } from 'neon';

import { Counter } from './state';
import { IncrementCommand, DecrementCommand } from './commands';

export class CounterDomainContext extends DomainContext<Counter> {
  constructor() {
    super({ value: 0 });

    this.registerCommand(new IncrementCommand());
    this.registerCommand(new DecrementCommand());
  }

  public getId() {
    return 'context.counterDomain';
  }
}
