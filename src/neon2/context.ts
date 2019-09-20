import { cloneDeep } from 'lodash';

import { Command } from './command';

export interface Context<TState> {
  readonly id: string;
  readonly state: TState;
  canExecute(command: Command<TState>): boolean;
  execute(command: Command<TState>): void;
}

export class NeonContext<TState> implements Context<TState> {
  private _state: TState;

  constructor(private _id: string, initialState: TState) {
    this._state = cloneDeep(initialState);
  }

  public get id() {
    return this._id;
  }

  public get state() {
    return this._state;
  }

  public canExecute(command: Command<TState>): boolean {
    return command.canExecute(this);
  }

  public execute(command: Command<TState>) {
    const newState = command.execute(this);
    this._state = newState;
  }
}
