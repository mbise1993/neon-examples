import { FixedStack } from 'mnemonist';
import { times } from 'lodash';

export interface HistoryFrame {
  name: string;
  serializedState: string;
}

export class History<TState> {
  private _pastFrames: FixedStack<HistoryFrame>;
  private _futureFrames: FixedStack<HistoryFrame>;

  constructor(capacity: number, private _getState: () => TState) {
    this._pastFrames = new FixedStack<HistoryFrame>(Array, capacity);
    this._futureFrames = new FixedStack<HistoryFrame>(Array, capacity);
  }

  public push(frameName: string) {
    const frame: HistoryFrame = {
      name: frameName,
      serializedState: JSON.stringify(this._getState()),
    };

    this._pastFrames.push(frame);
  }

  private pushRedo(frameName: string) {
    const frame: HistoryFrame = {
      name: frameName,
      serializedState: JSON.stringify(this._getState()),
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
    this.pushRedo('Redo');
    return this.go(numFrames, this._pastFrames);
  }

  public goForward(numFrames: number) {
    this.push('Undo');
    return this.go(numFrames, this._futureFrames);
  }

  private go(numFrames: number, popStack: FixedStack<HistoryFrame>): TState {
    if (numFrames < 1) {
      throw new Error('numFrames must be >= 1');
    }
    if (numFrames > popStack.size) {
      throw new Error(`Only ${popStack.size} frames available`);
    }

    let frame = popStack.pop() as HistoryFrame;
    times(numFrames - 1, () => {
      frame = popStack.pop() as HistoryFrame;
    });

    return JSON.parse(frame.serializedState) as TState;
  }
}
