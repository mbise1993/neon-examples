import { Context, Selector } from './context';
import { Service } from './service';

export interface CommandInfo {
  readonly id: string;
  readonly description: string;
  readonly keybinding?: string;
}

export interface Command<TState, TArgs> extends CommandInfo {
  readonly supportsUndo: boolean;
  readonly requeryOnChange: Selector<TState, any>[];
  readonly canExecute: (context: Context<TState>) => boolean;
  readonly execute: (context: Context<TState>, args: TArgs) => TState;
}

export type CommandArgsType<T extends Command<any, any>> = Parameters<
  Pick<T, 'execute'>['execute']
>[1];

export const createCommand = <TState, TArgs>(
  command: Partial<Command<TState, TArgs>>,
): Command<TState, TArgs> => {
  const defaultCommand: Command<TState, TArgs> = {
    id: '',
    description: '',
    supportsUndo: false,
    requeryOnChange: [],
    canExecute: () => true,
    execute: context => context.state,
  };

  return {
    ...defaultCommand,
    ...command,
  };
};

export class CommandService<TState> implements Service {
  public static readonly id = 'neon.commandService';
  private _commands: Record<string, Command<TState, any>> = {};

  public get id() {
    return CommandService.id;
  }

  public get commands() {
    return Object.values(this._commands);
  }

  public register(command: Command<TState, any>) {
    this._commands[command.id] = command;
  }

  public canExecute(context: Context<TState>, commandId: string) {
    const command = this._commands[commandId];
    return command.canExecute(context);
  }

  public execute<T extends Command<any, any>>(
    context: Context<TState>,
    command: T,
    args: CommandArgsType<T>,
  ): TState {
    if (!this.canExecute(context, command.id)) {
      throw new Error(`Cannot execute command '${command.id} on context '${context.id}'`);
    }

    if (command.supportsUndo) {
      context.history.push(command.description);
    }

    return command.execute(context, args);
  }
}

export interface Keybinding {
  keyCode: string;
  command: Command<any, any>;
}
