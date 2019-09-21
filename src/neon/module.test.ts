import { mockContext, mockCommand, mockCommandHooks, mockModuleHooks } from './test-utilities';
import { AbstractModule } from './module';

interface State {
  value: number;
}

let command1 = mockCommand('command1', 'a');
let command2 = mockCommand('command2');

export class TestModule extends AbstractModule<State> {
  private _nextId = 1;

  constructor() {
    super('test', [command1, command2]);
  }

  public createContext() {
    const currentId = this._nextId;
    this._nextId++;
    return mockContext(`context${currentId}`, { value: 1 });
  }
}

describe('Module', () => {
  beforeEach(() => jest.resetAllMocks());

  it('can get id', () => {
    const mod = new TestModule();
    expect(mod.id).toMatch('test');
  });

  it('can get provided commands', () => {
    const mod = new TestModule();
    expect(mod.providedCommands.length).toBe(2);
  });

  it('can attach context', () => {
    const mod = new TestModule();
    mod.attachContext(mod.createContext());
    mod.attachContext(mod.createContext());

    expect(mod.contexts.length).toBe(2);
  });

  it('can detach context', () => {
    const mod = new TestModule();
    const context1 = mod.createContext();
    mod.attachContext(context1);
    mod.attachContext(mod.createContext());
    mod.detachContext(context1);

    expect(mod.contexts.length).toBe(1);
  });

  it('can activate context', () => {
    const mod = new TestModule();
    const context1 = mod.createContext();
    mod.attachContext(context1);
    mod.attachContext(mod.createContext());
    mod.activateContext(context1);

    expect(mod.activeContext).toBe(context1);
  });

  it('can determine if a command can execute', () => {
    const mod = new TestModule();
    const context = mod.createContext();
    mod.attachContext(context);
    mod.activateContext(context);
    mod.canExecuteCommand(command1);

    expect(context.canExecute).toHaveBeenCalledTimes(1);
    expect(context.canExecute).toHaveBeenCalledWith(command1);
  });

  it('can execute command', () => {
    const mod = new TestModule();
    const context = mod.createContext();
    mod.attachContext(context);
    mod.activateContext(context);
    mod.executeCommand(command1);

    expect(context.execute).toHaveBeenCalledTimes(1);
    expect(context.execute).toHaveBeenCalledWith(command1);
  });

  it('can determine if it can handle a key code', () => {
    const mod = new TestModule();
    const context = mod.createContext();
    context.canExecute = () => true;
    mod.attachContext(context);
    mod.activateContext(context);

    expect(mod.canHandleKeyCode('a')).toBeTruthy();
    expect(mod.canHandleKeyCode('b')).toBeFalsy();
  });

  it('can execute a command by key code', () => {
    const mod = new TestModule();
    const context1 = mod.createContext();
    context1.canExecute = () => true;
    mod.attachContext(context1);
    mod.activateContext(context1);
    mod.handleKeyCode('a');

    expect(context1.execute).toHaveBeenCalledTimes(1);
    expect(context1.execute).toHaveBeenCalledWith(command1);
  });

  it('invokes registered command hooks', () => {
    const mod = new TestModule();
    const context = mod.createContext();
    mod.attachContext(context);
    mod.activateContext(context);
    const hooks = mockCommandHooks();
    mod.registerHook(hooks);

    mod.executeCommand(command1);
    expect(hooks.willExecuteImpl).toHaveBeenCalledTimes(1);
    expect(hooks.willExecuteImpl).toHaveBeenCalledWith(context, command1);
    expect(hooks.didExecuteImpl).toHaveBeenCalledTimes(1);
    expect(hooks.didExecuteImpl).toHaveBeenCalledWith(context, command1);
  });

  it('invokes registered module hooks', () => {
    const mod = new TestModule();
    const hooks = mockModuleHooks();
    mod.registerHook(hooks);

    const context = mod.createContext();
    mod.attachContext(context);
    expect(hooks.willAttachContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.willAttachContextImpl).toHaveBeenCalledWith(context);
    expect(hooks.didAttachContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.didAttachContextImpl).toHaveBeenCalledWith(context);

    mod.activateContext(context);
    expect(hooks.willActivateContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.willActivateContextImpl).toHaveBeenCalledWith(undefined, context);
    expect(hooks.didActivateContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.didActivateContextImpl).toHaveBeenCalledWith(context);

    mod.detachContext(context);
    expect(hooks.willDetachContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.willDetachContextImpl).toHaveBeenCalledWith(context);
    expect(hooks.didDetachContextImpl).toHaveBeenCalledTimes(1);
    expect(hooks.didDetachContextImpl).toHaveBeenCalledWith(context);
  });
});
