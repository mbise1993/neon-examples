import { App } from './app';
import { Context } from './context';
import { Command, CommandHooks } from './command';
import { StateChangedHook } from './state';
import { Hooks, HooksProvider } from './hooks';

export interface ModuleHooks<TState> {
  readonly willActivateContext?: (
    current: Context<TState> | undefined,
    next: Context<TState>,
  ) => void;
  readonly didActivateContext?: (context: Context<TState>) => void;
  readonly willAttachContext?: (context: Context<TState>) => void;
  readonly didAttachContext?: (context: Context<TState>) => void;
  readonly willDetachContext?: (context: Context<TState>) => void;
  readonly didDetachContext?: (context: Context<TState>) => void;
}

type ModuleHooksType<TState> = ModuleHooks<TState> | CommandHooks<TState>;

const isModuleHook = <TState>(hook: ModuleHooksType<TState>): hook is ModuleHooks<TState> => {
  return 'willActivateContext' in hook;
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
  private _commandHooks = new Hooks<CommandHooks<TState>>();

  constructor(private _id: string, commands: Command<TState>[]) {
    commands.forEach(command => {
      this._commands[command.id] = command;
      if (command.keybinding) {
        this._keybindings[command.keybinding] = command.id;
      }

      command.requeryOnChange.forEach(selector => {
        this._stateChangedHooks.push(
          new StateChangedHook(selector, () =>
            this._commandHooks.invokeAll('canExecuteChanged', [command]),
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
    this._moduleHooks.invokeAll('willAttachContext', [context]);
    this._contexts[context.id] = context;
    this._moduleHooks.invokeAll('didAttachContext', [context]);
  }

  public detachContext(context: Context<TState>) {
    this._moduleHooks.invokeAll('willDetachContext', [context]);
    delete this._contexts[context.id];
    this._moduleHooks.invokeAll('didDetachContext', [context]);
  }

  public activateContext(context: Context<TState>) {
    if (this._activeContext) {
      for (const hook of this._stateChangedHooks) {
        this._activeContext.removeHook(hook);
      }
    }

    this._moduleHooks.invokeAll('willActivateContext', [this._activeContext, context]);
    this._activeContext = context;
    this._moduleHooks.invokeAll('didActivateContext', [this._activeContext]);

    for (const hook of this._stateChangedHooks) {
      this._activeContext.registerHook(hook);
    }

    Object.values(this._commands).forEach(command =>
      this._commandHooks.invokeAll('canExecuteChanged', [command]),
    );
  }

  public canExecuteCommand(command: Command<TState>) {
    return this.activeContext ? this.activeContext.canExecute(command) : false;
  }

  public executeCommand(command: Command<TState>) {
    if (!this.activeContext) {
      throw new Error(`No active context, cannot execute command`);
    }

    this._commandHooks.invokeAll('willExecute', [this.activeContext, command]);
    this.activeContext.execute(command);
    this._commandHooks.invokeAll('didExecute', [this.activeContext, command]);
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

    const command = this._commands[commandId];
    if (this.canExecuteCommand(command)) {
      this.executeCommand(command);
    }
  }

  public registerHook(hook: ModuleHooksType<TState>) {
    if (isModuleHook(hook)) {
      this._moduleHooks.register(hook);
    } else {
      this._commandHooks.register(hook);
    }
  }

  public removeHook(hook: ModuleHooksType<TState>) {
    if (isModuleHook(hook)) {
      this._moduleHooks.remove(hook);
    } else {
      this._commandHooks.remove(hook);
    }
  }
}
