import { TestService, updateCountCommand, CounterContext } from './testUtil';
import { NeonCommands } from './context';

describe('DomainContext', () => {
  it('can lookup registered Services', () => {
    const context = new CounterContext();
    context.registerService(new TestService());
    const service = context.getService(TestService);

    expect(service).toBeTruthy();
  });

  it('can execute registered Commands', () => {
    const context = new CounterContext();
    context.handleCommands(updateCountCommand);
    context.executeCommand(updateCountCommand, { newCount: 2 });

    expect(context.state.count).toBe(2);
  });

  it('can undo and redo', () => {
    const context = new CounterContext();
    context.handleCommands(updateCountCommand);
    context.handleCommands(NeonCommands.undo);
    context.handleCommands(NeonCommands.redo);

    context.executeCommand(updateCountCommand, { newCount: 2 });
    context.executeCommand(updateCountCommand, { newCount: 3 });
    expect(context.state.count).toBe(3);

    context.executeCommand(NeonCommands.undo, {});
    expect(context.state.count).toBe(2);

    context.executeCommand(NeonCommands.redo, {});
    expect(context.state.count).toBe(3);
  });

  it('can subscribe to state changes', () => {
    const context = new CounterContext();
    context.handleCommands(updateCountCommand);

    const handler = jest.fn();
    context.onStateChange(state => state.count, handler);
    context.executeCommand(updateCountCommand, { newCount: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(2);
  });
});
