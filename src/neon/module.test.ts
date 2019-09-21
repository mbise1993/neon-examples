import { mockContext, mockCommand } from './test-utilities';
import { AbstractModule } from './module';

interface State {
  value: number;
}

export class TestModule extends AbstractModule<State> {
  private _nextId = 1;

  constructor() {
    super('test', [mockCommand('command1'), mockCommand('command2')]);
  }

  public createContext() {
    return mockContext(`context-${this._nextId}`, { value: 1 });
  }
}

describe('Module', () => {
  it('can get id', () => {
    const mod = new TestModule();
    expect(mod.id).toMatch('test');
  });
});
