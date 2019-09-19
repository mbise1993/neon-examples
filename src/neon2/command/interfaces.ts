import { Context } from '../context';
import { Selector } from '../state';

export interface CommandInfo {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly keybinding?: string;
  readonly supportsUndo?: boolean;
}

export interface Command<TState> {
  readonly requeryAfter?: Selector<TState, any>[];
  canExecute(context: Context<TState>): boolean;
  execute(context: Context<TState>): TState;
}

export interface CommandConfig<TState> {
  info: CommandInfo;
  readonly command: Command<TState>;
}
