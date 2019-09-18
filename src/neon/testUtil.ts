import { DomainContext, Service } from '.';
import { createCommand } from './command';

export interface State {
  count: number;
}

export interface UpdateCountArgs {
  newCount: number;
}

export const updateCountCommand = createCommand<State, UpdateCountArgs>({
  id: 'command.updateCount',
  description: 'Update the count',
  supportsUndo: true,
  execute: (_context, args) => ({
    count: args.newCount,
  }),
});

export class TestService extends Service {
  public static readonly id = 'test-service';
}

export class TestDomainContext extends DomainContext<State> {
  constructor() {
    super('context.counterDomain', { count: 1 });
  }
}
