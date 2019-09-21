import { cloneDeep, pull } from 'lodash';

import { Command, CommandHooks } from './command';
import { StateHooks } from './state';
import { History } from './history';

type ContextHooks<TState> = StateHooks<TState, any> | CommandHooks<TState>;

const isStateHook = <TState>(hook: ContextHooks<TState>): hook is StateHooks<TState, any> => {
  return 'select' in hook;
};

export interface Context<TState> {
  readonly id: string;
  readonly state: TState;
  readonly history: History<TState>;
  canExecute(command: Command<TState>): boolean;
  execute(command: Command<TState>): void;
  registerHook(hook: ContextHooks<TState>): void;
  removeHook(hook: ContextHooks<TState>): void;
}

export class NeonContext<TState> implements Context<TState> {
  private _state: TState;
  private _history: History<TState>;
  private _stateHooks: StateHooks<TState, any>[] = [];
  private _commandHooks: CommandHooks<TState>[] = [];

  constructor(private _id: string, initialState: TState) {
    this._state = cloneDeep(initialState);
    this._history = new History(this, 20);
    this.registerHook(this._history);
  }

  public get id() {
    return this._id;
  }

  public get state() {
    return this._state;
  }

  public get history() {
    return this._history;
  }

  public canExecute(command: Command<TState>): boolean {
    return command.canExecute(this);
  }

  public execute(command: Command<TState>) {
    this._commandHooks.forEach(hook => hook.onWillExecute && hook.onWillExecute(this, command));
    const newState = command.execute(this);
    this._commandHooks.forEach(hook => hook.onDidExecute && hook.onDidExecute(this, command));

    this.setState(newState);
  }

  public registerHook(hook: ContextHooks<TState>) {
    if (isStateHook(hook)) {
      this._stateHooks.push(hook);
    } else {
      this._commandHooks.push(hook);
    }
  }

  public removeHook(hook: ContextHooks<TState>) {
    if (isStateHook(hook)) {
      pull(this._stateHooks, hook);
    } else {
      pull(this._commandHooks, hook);
    }
  }

  private setState(newState: TState) {
    const stateClone = cloneDeep(this.state);
    const executeAfterChange = new Array<() => void>();

    this._stateHooks.forEach(hook => {
      const value = hook.select(stateClone);
      const nextValue = hook.select(newState);
      if (value !== nextValue) {
        hook.onWillChange && hook.onWillChange(value, nextValue);
        executeAfterChange.push(() => hook.onDidChange && hook.onDidChange(nextValue, value));
      }
    });

    this._state = newState;

    executeAfterChange.forEach(func => func());
  }
}
