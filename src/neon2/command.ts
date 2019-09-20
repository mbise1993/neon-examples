import { Context } from './context';

export interface Command<TState> {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly keybinding?: string;
  readonly supportsUndo?: boolean;
  canExecute(context: Context<TState>): boolean;
  execute(context: Context<TState>): TState;
}

export interface CommandRouter<TArgs> {
  route(command: Command<any>, args: TArgs): void;
}
