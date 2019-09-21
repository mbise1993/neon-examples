import { NeonContext } from '../context';
import { Command } from '../command';
import { AbstractModule } from '../module';

export interface TestState {
  value: number;
}

const createTestCommand = (id: string): Command<TestState> => {
  return {
    id,
    name: id,
    requeryOnChange: [],
    canExecute: () => true,
    execute: context => {
      return {
        ...context.state,
        value: context.state.value + 1,
      };
    },
  };
};

export class TestModule extends AbstractModule<TestState> {
  private _nextContextId = 1;

  constructor(private _moduleId: string) {
    super(`${_moduleId}.module`, [
      createTestCommand(`${_moduleId}.command.foo`),
      createTestCommand(`${_moduleId}.command.bar`),
    ]);
  }

  public createContext() {
    const id = this._nextContextId;
    this._nextContextId++;
    return new NeonContext(`${this._moduleId}.context.${id}`, { value: 1 });
  }
}
