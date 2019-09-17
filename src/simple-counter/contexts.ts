import { DomainContext } from 'neon';

import { Counter } from './state';

export class CounterDomainContext extends DomainContext<Counter> {
  constructor() {
    super({ value: 0 });
  }

  public getId() {
    return 'context.counterDomain';
  }
}
