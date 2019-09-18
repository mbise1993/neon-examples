import { TestService, updateCountCommand, TestDomainContext } from './testUtil';
import { undoCommand, redoCommand } from './domainContext';

describe('DomainContext', () => {
  it('can lookup registered Services', () => {
    const context = new TestDomainContext();
    context.registerService(new TestService());
    const service = context.getService(TestService);

    expect(service).toBeTruthy();
  });

  it('can execute registered Commands', () => {
    const context = new TestDomainContext();
    context.registerCommand(updateCountCommand);
    context.executeCommand(updateCountCommand, { newCount: 2 });

    expect(context.state.count).toBe(2);
  });

  it('can undo and redo', () => {
    const context = new TestDomainContext();
    context.registerCommand(updateCountCommand);
    context.registerCommand(undoCommand);
    context.registerCommand(redoCommand);

    context.executeCommand(updateCountCommand, { newCount: 2 });
    context.executeCommand(updateCountCommand, { newCount: 3 });
    expect(context.state.count).toBe(3);

    context.executeCommand(undoCommand, {});
    expect(context.state.count).toBe(2);

    context.executeCommand(redoCommand, {});
    expect(context.state.count).toBe(3);
  });

  it('can subscribe to state changes', () => {
    const context = new TestDomainContext();
    context.registerCommand(updateCountCommand);

    const handler = jest.fn();
    context.subscribe(state => state.count, handler);
    context.executeCommand(updateCountCommand, { newCount: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(2);
  });
});
