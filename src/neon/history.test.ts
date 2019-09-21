import { History } from './history';
import { Command } from './command';
import { NeonContext } from './context';
import { mockCommand } from './test-utilities';

interface State {
  value: number;
}

const incrementCommand: Command<State> = {
  id: 'increment',
  name: 'increment',
  supportsUndo: true,
  requeryOnChange: [],
  canExecute: () => true,
  execute: context => ({ value: context.state.value + 1 }),
};

describe(History.name, () => {
  it('pushes frames when a command is executed that supports undo', () => {
    const context = new NeonContext('test', { value: 1 });
    const history = new History(context, 3);
    context.registerHook(history);
    context.execute(incrementCommand);

    expect(history.hasPastFrames()).toBeTruthy();
  });

  it('does not push frames when a command is executed that does not support undo', () => {
    const context = new NeonContext('test', { value: 1 });
    const history = new History(context, 5);
    context.registerHook(history);
    context.execute(mockCommand('no-undo'));

    expect(history.hasPastFrames()).toBeFalsy();
  });

  it('can go back', () => {
    const context = new NeonContext('test', { value: 1 });
    const history = new History(context, 5);
    context.registerHook(history);
    context.execute(incrementCommand);
    context.execute(incrementCommand);

    expect(history.goBack(1)).toEqual({ value: 2 });
    expect(history.goBack(1)).toEqual({ value: 1 });
  });

  it('can go forward', () => {
    const context = new NeonContext('test', { value: 1 });
    const history = new History(context, 5);
    context.registerHook(history);
    context.execute(incrementCommand);
    context.execute(incrementCommand);

    history.goBack(1);
    expect(history.goForward(1)).toEqual({ value: 3 });
  });
});
