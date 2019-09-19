import { Context } from '../context';
import { SubscriptionManager } from '../utilities/events';
import { StateFacade } from '../state';
import { CommandInfo, CommandConfig } from './interfaces';

export interface CommandEvents<TState> {
  WILL_EXECUTE: {
    readonly commandInfo: CommandInfo;
    readonly context: Context<TState>;
  };
  DID_EXECUTE: {
    readonly commandInfo: CommandInfo;
    readonly context: Context<TState>;
  };
  REQUEST_REQUERY: {
    readonly commandInfo: CommandInfo;
  };
  INFO_CHANGED: {
    readonly commandInfo: CommandInfo;
  };
}

export class CommandProvider<TState> {
  private _configs: Record<string, CommandConfig<TState>> = {};
  private _subscriptions = new SubscriptionManager<CommandEvents<TState>>();

  constructor(state: StateFacade<TState>, configs: CommandConfig<TState>[]) {
    configs.forEach(config => {
      this._configs[config.info.id] = config;
      if (config.command.requeryAfter) {
        config.command.requeryAfter.forEach(selector => {
          state.subscribe(selector, () =>
            this._subscriptions.fire('REQUEST_REQUERY', {
              commandInfo: config.info,
            }),
          );
        });
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
    this._subscriptions.fire('DID_EXECUTE', { commandInfo: info, context });
  }

  public subscribe<TType extends keyof CommandEvents<TState>>(
    event: TType,
    handler: (args: CommandEvents<TState>[TType]) => void,
  ) {
    return this._subscriptions.subscribe(event, handler);
  }
}
