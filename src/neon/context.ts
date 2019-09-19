import { Command, CommandInfo, CommandArgsType, createCommand } from './command';
import { History } from './history';
import { Service, ServiceType } from './service';
import { NeonApp } from './app';
import { EventEmitter } from './eventEmitter';

export interface Selector<TState, TSelected> {
  (state: TState): TSelected;
}

export interface Handler<TSelected> {
  (value: TSelected): void;
}

export interface StateChangeData<TState, TSelected> {
  selector: Selector<TState, TSelected>;
  handler: Handler<TSelected>;
}

export interface RequeryCanExecuteData<TState> {
  command: Command<TState, any>;
  handler: RequeryCanExecuteHandler<TState>;
}

export interface RequeryCanExecuteHandler<TState> {
  (command: Command<TState, any>): void;
}

export const NeonCommands = {
  undo: createCommand<any, any>({
    id: 'command.undo',
    description: 'Undo',
    requeryOnChange: [state => state],
    canExecute: context => context.history.hasPastFrames(),
    execute: context => context.history.goBack(1),
  }),
  redo: createCommand<any, any>({
    id: 'command.redo',
    description: 'Redo',
    requeryOnChange: [state => state],
    canExecute: context => context.history.hasFutureFrames(),
    execute: context => context.history.goForward(1),
  }),
};

export interface Context<TState> {
  readonly id: string;
  readonly state: TState;
  readonly history: History<TState>;
  readonly commands: Command<TState, any>[];
  getService<T extends ServiceType>(type: T): InstanceType<T>;
  canHandleCommand(command: CommandInfo): boolean;
  executeCommand<TCommand extends Command<any, any>>(
    command: TCommand,
    args: CommandArgsType<TCommand>,
  ): void;
  onStateChange<TSelected>(
    selector: Selector<TState, TSelected>,
    handler: Handler<TSelected>,
  ): () => void;
  onRequeryCanExecute(
    command: Command<TState, any>,
    handler: RequeryCanExecuteHandler<TState>,
  ): () => void;
  onWillAttach?: (app: NeonApp) => void;
  onDidAttach?: (app: NeonApp) => void;
  onWillDetach?: (app: NeonApp) => void;
  onDidDetach?: (app: NeonApp) => void;
}

export class NeonContext<TState> implements Context<TState> {
  private _services: Record<string, Service> = {};
  private _commands: Record<string, Command<TState, any>> = {};
  private _stateChangeEmitter = new EventEmitter<StateChangeData<TState, any>>();
  private _requeryCanExecuteEmitter = new EventEmitter<RequeryCanExecuteData<TState>>();
  private _history = new History<TState>(20, () => this.state);

  constructor(private _id: string, private _state: TState) {}

  public get id() {
    return this._id;
  }

  public get state() {
    return this._state;
  }

  public get history() {
    return this._history;
  }

  public get commands() {
    return Object.values(this._commands);
  }

  public getService<T extends ServiceType>(type: T): InstanceType<T> {
    const service = this._services[type.id];
    if (service instanceof type) {
      return service as InstanceType<T>;
    }

    throw new Error(`Service registered with ID '${type.id}' does not match type '${type.name}'`);
  }

  public registerService(service: Service) {
    this._services[service.id] = service;
  }

  public handleCommands(...commands: Command<TState, any>[]) {
    commands.forEach(command => {
      this._commands[command.id] = command;
      command.requeryOnChange.map(selector =>
        this.onStateChange(selector, () => {
          this._requeryCanExecuteEmitter.subscriptions.forEach(sub => {
            if (sub.data.command === command) {
              sub.data.handler(command);
            }
          });
        }),
      );
    });
  }

  public canHandleCommand(commandInfo: CommandInfo): boolean {
    const command = this._commands[commandInfo.id];
    return command && command.canExecute(this);
  }

  public executeCommand<TCommand extends Command<any, any>>(
    type: TCommand,
    args: CommandArgsType<TCommand>,
  ) {
    if (!this.canHandleCommand(type)) {
      throw new Error(`Context '${this.id}' cannot execute command '${type.id}'`);
    }

    const command = this._commands[type.id];
    if (command.supportsUndo) {
      this._history.push(command.description);
    }

    const newState = command.execute(this, args);
    this.setState(newState);
  }

  public onStateChange<TSelected>(
    selector: Selector<TState, TSelected>,
    handler: Handler<TSelected>,
  ) {
    return this._stateChangeEmitter.subscribe({
      selector,
      handler,
    });
  }

  public onRequeryCanExecute(
    command: Command<TState, any>,
    handler: RequeryCanExecuteHandler<TState>,
  ) {
    return this._requeryCanExecuteEmitter.subscribe({
      command,
      handler,
    });
  }

  public onDetach() {
    this._stateChangeEmitter.unsubscribeAll();
    this._requeryCanExecuteEmitter.unsubscribeAll();
  }

  private setState(newState: TState) {
    const subscribersToNotify: StateChangeData<TState, any>[] = [];
    this._stateChangeEmitter.subscriptions.forEach(subscription => {
      const value = subscription.data.selector(this._state);
      const newValue = subscription.data.selector(newState);
      if (value !== newValue) {
        subscribersToNotify.push(subscription.data);
      }
    });

    this._state = newState;

    subscribersToNotify.forEach(subscriber => {
      const value = subscriber.selector(this._state);
      subscriber.handler(value);
    });
  }
}

export interface DomainContextType<TState> {
  new (...args: any): Context<TState>;
}
