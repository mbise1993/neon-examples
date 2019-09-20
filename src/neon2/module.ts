import { App } from './app';
import { Context } from './context';
import { Command } from './command';

export interface Module<TState> {
  readonly id: string;
  readonly contexts: Context<TState>[];
  readonly activeContext: Context<TState> | undefined;
  readonly providedCommands: Command<any>[];
  createContext(): Context<TState>;
  attachContext(context: Context<TState>): void;
  detachContext(context: Context<TState>): void;
  activateContext(context: Context<TState>): void;
  canExecuteCommand(command: Command<TState>): boolean;
  executeCommand(command: Command<TState>): void;
  canHandleKeyCode(keyCode: string): boolean;
  handleKeyCode(keyCode: string): void;
  readonly onWillAttach?: (app: App) => void;
  readonly onDidAttach?: (app: App) => void;
  readonly onWillDetach?: (app: App) => void;
  readonly onDidDetach?: (app: App) => void;
}

export abstract class AbstractModule<TState> implements Module<TState> {
  private _contexts: Record<string, Context<TState>> = {};
  private _activeContext?: Context<TState>;
  private _commands: Record<string, Command<TState>> = {};
  private _keybindings: Record<string, string> = {};

  constructor(private _id: string, commands: Command<TState>[]) {
    commands.forEach(command => (this._commands[command.id] = command));
  }

  public get id() {
    return this._id;
  }

  public get contexts() {
    return Object.values(this._contexts);
  }

  public get activeContext() {
    return this._activeContext;
  }

  public get providedCommands() {
    return Object.values(this._commands);
  }

  public abstract createContext(): Context<TState>;

  public attachContext(context: Context<TState>) {
    this._contexts[context.id] = context;
  }

  public detachContext(context: Context<TState>) {
    delete this._contexts[context.id];
  }

  public activateContext(context: Context<TState>) {
    this._activeContext = context;
  }

  public canExecuteCommand(command: Command<TState>) {
    return this.activeContext ? command.canExecute(this.activeContext) : false;
  }

  public executeCommand(command: Command<TState>) {
    if (!this.activeContext) {
      throw new Error(`No active context, cannot execute command`);
    }

    command.execute(this.activeContext);
  }

  public canHandleKeyCode(keyCode: string) {
    const commandId = this._keybindings[keyCode];
    return !!commandId && this.canExecuteCommand(this._commands[commandId]);
  }

  public handleKeyCode(keyCode: string) {
    const commandId = this._keybindings[keyCode];
    if (!commandId) {
      throw new Error(`Module '${this.id}' cannot handle key code '${keyCode}'`);
    }

    this.executeCommand(this._commands[commandId]);
  }
}
