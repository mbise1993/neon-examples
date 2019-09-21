import { mockModule, mockCommand } from './test-utilities';
import { NeonApp } from './app';

describe('App', () => {
  it('can get name', () => {
    const app = new NeonApp('test');
    expect(app.name).toMatch('test');
  });

  it('can get modules', () => {
    const app = new NeonApp('test');
    app.attachModule(mockModule('module1'));
    app.attachModule(mockModule('module2'));
    expect(app.modules.length).toBe(2);
  });

  it('can get provided commands', () => {
    const app = new NeonApp('test');
    app.attachModule(mockModule('module1', [mockCommand('command1')]));
    app.attachModule(mockModule('module2', [mockCommand('command2')]));
    expect(app.providedCommands.length).toBe(2);
  });

  it('can attach module', () => {
    const app = new NeonApp('test');
    app.attachModule(mockModule('module1'));
    app.attachModule(mockModule('module2'));

    expect(app.modules.length).toBe(2);
  });

  it('can detach module', () => {
    const app = new NeonApp('test');
    const module1 = mockModule('module1');
    app.attachModule(module1);
    app.attachModule(mockModule('module2'));

    app.detachModule(module1);
    expect(app.modules.length).toBe(1);
  });

  it('can get command provider', () => {
    const app = new NeonApp('test');
    app.attachModule(mockModule('module1', [mockCommand('command1')]));
    app.attachModule(mockModule('module2', [mockCommand('command2')]));

    const provider = app.getCommandProvider('command1');
    expect(provider.id).toMatch('module1');
  });

  it('can execute command', () => {
    const app = new NeonApp('test');
    const module1 = mockModule('module1', [mockCommand('command1')]);
    app.attachModule(module1);

    app.executeCommandById('command1');
    expect(module1.executeCommand).toHaveBeenCalledTimes(1);
  });
});
