import { Context } from './context';
import { SubscriptionManager } from './events';
import { Selector } from './state';

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

export interface ExecutedEvent<TState> {
  readonly type: 'EXECUTED';
  readonly args: {
    readonly commandInfo: CommandInfo;
    readonly context: Context<TState>;
  };
}

export interface RequestRequeryEvent {
  readonly type: 'REQUEST_REQUERY';
  readonly args: {
    readonly commandInfo: CommandInfo;
  };
}

export interface InfoChangedEvent {
  readonly type: 'INFO_CHANGED';
  readonly args: {
    readonly commandInfo: CommandInfo;
  };
}

export type CommandEvent<TState> = ExecutedEvent<TState> | RequestRequeryEvent | InfoChangedEvent;

export class CommandProvider<TState> {
  private _configs: Record<string, CommandConfig<TState>> = {};
  private _subscriptions = new SubscriptionManager<CommandEvent<TState>>();

  constructor(configs: CommandConfig<TState>[]) {
    configs.forEach(config => {
      this._configs[config.info.id] = config;
      if (config.command.requeryAfter) {
        config.command.requeryAfter.forEach(selector => this.subscribeToRequeryAfter(selector));
      }
    });
  }

  public get availableCommands() {
    return Object.values(this._configs).map(config => config.info);
  }

  public updateCommandInfo(newInfo: Partial<CommandInfo> & { id: string }) {
    const config = this._configs[newInfo.id];
    if (!config) {
      throw new Error(`Command with ID '${newInfo.id}' not registered`);
    }

    config.info = { ...config.info, ...newInfo };
    this._subscriptions.fire('INFO_CHANGED', { commandInfo: config.info });
  }

  public canExecute(info: CommandInfo, context: Context<TState>): boolean {
    const config = this._configs[info.id];
    return config && config.command.canExecute(context);
  }

  public execute(info: CommandInfo, context: Context<TState>) {
    if (!this.canExecute(info, context)) {
      throw new Error(`Cannot execute command '${info.name}'`);
    }

    const command = this._configs[info.id].command;
    command.execute(context);
    this._subscriptions.fire('EXECUTED', { commandInfo: info });
  }

  public subscribe(event: CommandEvent<TState>['type'], handler: () => void) {
    this._subscriptions.subscribe(event, handler);
  }

  private subscribeToRequeryAfter(selector: Selector<TState, any>) {
    this._subscriptions.subscribe('EXECUTED', args => {
      if (args.commandInfo.id === id) {
        this._subscriptions.fire('REQUEST_REQUERY', args);
      }
    });
  }
}
