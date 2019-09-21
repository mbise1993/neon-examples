import { mockCommand, mockCommandHooks, mockStateHooks } from './test-utilities';
import { NeonContext } from './context';

describe('Context', () => {
  it('can get id', () => {
    const context = new NeonContext('test', {});
    expect(context.id).toMatch('test');
  });

  it('can determine if a command can execute', () => {
    const context = new NeonContext('test', {});
    const command = mockCommand('command');

    const result = context.canExecute(command);
    expect(result).toBeTruthy();
    expect(command.canExecute).toHaveBeenCalledTimes(1);
    expect(command.canExecute).toHaveBeenCalledWith(context);
  });

  it('can execute a command', () => {
    const context = new NeonContext('test', { value: 1 });
    const command = mockCommand('command');
    command.execute = jest.fn(() => ({
      value: 5,
    }));

    context.execute(command);
    expect(command.canExecute).toHaveBeenCalledTimes(1);
    expect(command.execute).toHaveBeenCalledTimes(1);
    expect(command.execute).toHaveBeenCalledWith(context);
    expect(context.state).toEqual({ value: 5 });
  });

  it('invokes registered command hooks', () => {
    const context = new NeonContext('test', { value: 1 });
    const commandHooks = mockCommandHooks();
    context.registerHook(commandHooks);
    const command = mockCommand('command');

    context.execute(command);
    expect(commandHooks.onWillExecute).toHaveBeenCalledTimes(1);
    expect(commandHooks.onWillExecute).toHaveBeenCalledWith(context, command);
    expect(commandHooks.onDidExecute).toHaveBeenCalledTimes(1);
    expect(commandHooks.onDidExecute).toHaveBeenCalledWith(context, command);
  });

  it('invokes registered state hooks', () => {
    const context = new NeonContext('test', { value: 1 });
    const stateHooks = mockStateHooks();
    context.registerHook(stateHooks);
    const command = mockCommand('command');
    command.execute = jest.fn(() => ({
      value: 5,
    }));

    context.execute(command);
    expect(stateHooks.onWillChange).toHaveBeenCalledTimes(1);
    expect(stateHooks.onWillChange).toHaveBeenCalledWith({ value: 1 }, { value: 5 });
    expect(stateHooks.onDidChange).toHaveBeenCalledTimes(1);
    expect(stateHooks.onDidChange).toHaveBeenCalledWith({ value: 5 }, { value: 1 });
  });
});
