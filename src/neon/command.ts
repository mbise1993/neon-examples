import { Context } from './context';
import { Selector } from './state';

export interface Command<TState> {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly keybinding?: string;
  readonly supportsUndo?: boolean;
  readonly requeryOnChange: Selector<TState, any>[];
  canExecute(context: Context<TState>): boolean;
  execute(context: Context<TState>): TState;
}

export interface CommandRouter<TArgs> {
  route(command: Command<any>, args: TArgs): void;
}

export interface CommandHooks<TState> {
  readonly onCanExecuteChanged?: (command: Command<TState>) => void;
  readonly onWillExecute?: (context: Context<TState>, command: Command<TState>) => void;
  readonly onDidExecute?: (context: Context<TState>, command: Command<TState>) => void;
}

export class CanExecuteChangedHook<TState> implements CommandHooks<TState> {
  constructor(private _handler: Required<CommandHooks<TState>>['onCanExecuteChanged']) {}

  public onCanExecuteChanged(command: Command<TState>) {
    this._handler(command);
  }
}
