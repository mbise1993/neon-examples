import { FixedStack } from 'mnemonist';
import { times } from 'lodash';

import { Command, CommandHooks } from './command';
import { Context } from './context';
import { StateProvider } from './state';

export interface HistoryFrame<TState> {
  command: Command<TState>;
  serializedState: string;
}

export class History<TState> implements CommandHooks<TState> {
  private _pastFrames: FixedStack<HistoryFrame<TState>>;
  private _futureFrames: FixedStack<HistoryFrame<TState>>;

  constructor(private _stateProvider: StateProvider<TState>, capacity: number) {
    this._pastFrames = new FixedStack<HistoryFrame<TState>>(Array, capacity);
    this._futureFrames = new FixedStack<HistoryFrame<TState>>(Array, capacity);
  }

  public willExecute(_context: Context<TState>, command: Command<TState>) {
    if (command.supportsUndo) {
      this._futureFrames.clear();
      this.push(command);
    }
  }

  public push(command: Command<TState>) {
    const frame: HistoryFrame<TState> = {
      command,
      serializedState: JSON.stringify(this._stateProvider.state),
    };

    this._pastFrames.push(frame);
  }

  private pushRedo(command: Command<TState>) {
    const frame: HistoryFrame<TState> = {
      command,
      serializedState: JSON.stringify(this._stateProvider.state),
    };

    this._futureFrames.push(frame);
  }

  public hasPastFrames() {
    return this._pastFrames.size > 0;
  }

  public hasFutureFrames() {
    return this._futureFrames.size > 0;
  }

  public goBack(numFrames: number) {
    const top = this._pastFrames.peek();
    if (!top) {
      throw new Error('No past frames');
    }

    this.pushRedo(top.command);
    return this.go(numFrames, this._pastFrames);
  }

  public goForward(numFrames: number) {
    const top = this._futureFrames.peek();
    if (!top) {
      throw new Error('No future frames');
    }

    this.push(top.command);
    return this.go(numFrames, this._futureFrames);
  }

  private go(numFrames: number, popStack: FixedStack<HistoryFrame<TState>>): TState {
    if (numFrames < 1) {
      throw new Error('numFrames must be >= 1');
    }
    if (numFrames > popStack.size) {
      throw new Error(`Only ${popStack.size} frames available`);
    }

    let frame = popStack.pop() as HistoryFrame<TState>;
    times(numFrames - 1, () => {
      frame = popStack.pop() as HistoryFrame<TState>;
    });

    return JSON.parse(frame.serializedState) as TState;
  }
}
