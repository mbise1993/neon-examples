import { DomainContext } from 'neon';

import { Counter } from './state';
import { incrementCommand, decrementCommand } from './commands';

export class CounterDomainContext extends DomainContext<Counter> {
  constructor() {
    super('context.counterDomain', { value: 0 });

    this.registerCommand(incrementCommand);
    this.registerCommand(decrementCommand);
  }
}
