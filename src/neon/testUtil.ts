import { NeonContext, Service } from '.';
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

export class TestService implements Service {
  public static readonly id = 'test-service';

  public get id() {
    return TestService.id;
  }
}

export class CounterContext extends NeonContext<State> {
  constructor(count = 1) {
    super('context.counter', { count });
    this.handleCommands(updateCountCommand);
  }
}
