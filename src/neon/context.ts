import { cloneDeep } from 'lodash';

import { Command, CommandHooks } from './command';
import { StateProvider, StateHooks } from './state';
import { History } from './history';
import { Hooks, HooksProvider } from './hooks';

type ContextHooksType<TState> = StateHooks<TState, any> | CommandHooks<TState>;

const isStateHook = <TState>(hook: ContextHooksType<TState>): hook is StateHooks<TState, any> => {
  return 'select' in hook;
};

export interface Context<TState>
  extends StateProvider<TState>,
    HooksProvider<ContextHooksType<TState>> {
  readonly id: string;
  readonly history: History<TState>;
  canExecute(command: Command<TState>): boolean;
  execute(command: Command<TState>): void;
  registerHook(hook: ContextHooksType<TState>): void;
  removeHook(hook: ContextHooksType<TState>): void;
}

export class NeonContext<TState> implements Context<TState> {
  private _state: TState;
  private _history: History<TState>;
  private _stateHooks = new Hooks<StateHooks<TState, any>>();
  private _commandHooks = new Hooks<CommandHooks<TState>>();

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
    if (!this.canExecute(command)) {
      throw new Error(`Context '${this.id}' cannot execute command '${command.id}'`);
    }

    this._commandHooks.invokeAll('willExecute', [this, command]);
    const newState = command.execute(this);
    this._commandHooks.invokeAll('didExecute', [this, command]);

    this.setState(newState);
  }

  public registerHook(hook: ContextHooksType<TState>) {
    if (isStateHook(hook)) {
      this._stateHooks.register(hook);
    } else {
      this._commandHooks.register(hook);
    }
  }

  public removeHook(hook: ContextHooksType<TState>) {
    if (isStateHook(hook)) {
      this._stateHooks.remove(hook);
    } else {
      this._commandHooks.remove(hook);
    }
  }

  private setState(newState: TState) {
    const stateClone = cloneDeep(this.state);
    const executeAfterChange = new Array<() => void>();

    this._stateHooks.forEach(hook => {
      const value = hook.select(stateClone);
      const nextValue = hook.select(newState);
      if (value !== nextValue) {
        hook.willChange && hook.willChange(value, nextValue);
        executeAfterChange.push(() => hook.didChange && hook.didChange(nextValue, value));
      }
    });

    this._state = newState;

    executeAfterChange.forEach(func => func());
  }
}
