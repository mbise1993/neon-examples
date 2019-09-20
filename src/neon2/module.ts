import { App } from './app';
import { Context } from './context';
import { Command } from './command';
import { StateChangedHook } from './state';
import { Hooks, HooksProvider } from './hooks';

export interface ModuleHooks<TState> {
  readonly activeContextWillChange?: (
    current: Context<TState> | undefined,
    next: Context<TState>,
  ) => void;
  readonly activeContextDidChange?: (context: Context<TState>) => void;
  readonly contextWillAttach?: (context: Context<TState>) => void;
  readonly contextDidAttach?: (context: Context<TState>) => void;
  readonly contextWillDetach?: (context: Context<TState>) => void;
  readonly contextDidDetach?: (context: Context<TState>) => void;
}

export interface CanExecuteChangedHook<TState> {
  readonly onCanExecuteChanged?: (command: Command<TState>) => void;
}

type ModuleHooksType<TState> = ModuleHooks<TState> | CanExecuteChangedHook<TState>;

const isModuleHook = <TState>(hook: ModuleHooksType<TState>): hook is ModuleHooks<TState> => {
  return 'activeContextWillChange' in hook;
};

export interface Module<TState> extends HooksProvider<ModuleHooksType<TState>> {
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
  private _stateChangedHooks: StateChangedHook<TState, any>[] = [];
  private _moduleHooks = new Hooks<ModuleHooks<TState>>();
  private _canExecuteChangedHooks = new Hooks<CanExecuteChangedHook<TState>>();

  constructor(private _id: string, commands: Command<TState>[]) {
    commands.forEach(command => {
      this._commands[command.id] = command;
      command.requeryOnChange.forEach(selector => {
        this._stateChangedHooks.push(
          new StateChangedHook(selector, () =>
            this._canExecuteChangedHooks.invoke('onCanExecuteChanged', [command]),
          ),
        );
      });
    });
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
    this._moduleHooks.invoke('contextWillAttach', [context]);
    this._contexts[context.id] = context;
    this._moduleHooks.invoke('contextDidAttach', [context]);
  }

  public detachContext(context: Context<TState>) {
    this._moduleHooks.invoke('contextWillDetach', [context]);
    delete this._contexts[context.id];
    this._moduleHooks.invoke('contextDidDetach', [context]);
  }

  public activateContext(context: Context<TState>) {
    if (this._activeContext) {
      for (const hook of this._stateChangedHooks) {
        this._activeContext.removeHook(hook);
      }
    }

    this._moduleHooks.invoke('activeContextWillChange', [this._activeContext, context]);
    this._activeContext = context;
    this._moduleHooks.invoke('activeContextDidChange', [this._activeContext]);

    for (const hook of this._stateChangedHooks) {
      this._activeContext.registerHook(hook);
    }
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

  public registerHook(hook: ModuleHooksType<TState>) {
    if (isModuleHook(hook)) {
      this._moduleHooks.register(hook);
    } else {
      this._canExecuteChangedHooks.register(hook);
    }
  }

  public removeHook(hook: ModuleHooksType<TState>) {
    if (isModuleHook(hook)) {
      this._moduleHooks.remove(hook);
    } else {
      this._canExecuteChangedHooks.remove(hook);
    }
  }
}
