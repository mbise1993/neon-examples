import { Command, CommandInfo, CommandArgsType, createCommand } from './command';
import { History } from './history';
import { Service, ServiceType } from './service';

export interface Selector<TState, TSelected> {
  (state: TState): TSelected;
}

export interface Handler<TSelected> {
  (value: TSelected): void;
}

export interface Subscription<TState, TSelected> {
  id: number;
  selector: Selector<TState, TSelected>;
  handler: Handler<TSelected>;
  dispose: () => void;
}

export const undoCommand = createCommand<any, any>({
  id: 'command.undo',
  description: 'Undo',
  requeryOnChange: [],
  canExecute: context => context.history.hasPastFrames(),
  execute: context => context.history.goBack(1)
});

export const redoCommand = createCommand<any, any>({
  id: 'command.redo',
  description: 'Redo',
  requeryOnChange: [],
  canExecute: context => context.history.hasFutureFrames(),
  execute: context => context.history.goForward(1)
});

export abstract class DomainContext<TState> {
  private _services: Record<string, Service> = {};
  private _commands: Record<string, Command<TState, any>> = {};
  private _nextSubscriptionId = 1;
  private _subscribers: Subscription<TState, any>[] = [];
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

  public getCommands(): Command<TState, any>[] {
    return Object.values(this._commands);
  }

  public registerCommand(command: Command<TState, any>) {
    this._commands[command.id] = command;

    command.requeryOnChange.forEach(selector => {
      this.subscribe(selector, _value => command.canExecute(this));
    });
  }

  public canExecuteCommand(commandInfo: CommandInfo) {
    const command = this._commands[commandInfo.id];
    return command && command.canExecute(this);
  }

  public executeCommand<TCommand extends Command<any, any>>(
    type: TCommand,
    args: CommandArgsType<TCommand>
  ) {
    if (!this.canExecuteCommand(type)) {
      throw new Error(`Domain context '${this.id}' cannot execute command '${type.id}'`);
    }

    const command = this._commands[type.id];
    if (command.supportsUndo) {
      this._history.push(command.description);
    }

    const newState = command.execute(this, args);
    this.setState(newState);
  }

  public subscribe<TSelected>(selector: Selector<TState, TSelected>, handler: Handler<TSelected>) {
    const id = this._nextSubscriptionId;
    this._nextSubscriptionId++;

    this._subscribers.push({
      id: this._nextSubscriptionId,
      selector,
      handler,
      dispose: () => this._subscribers.filter(sub => sub.id !== id)
    });
  }

  public onDetach() {
    this._subscribers.forEach(sub => sub.dispose());
  }

  private setState(newState: TState) {
    const subscribersToNotify: Subscription<TState, any>[] = [];
    this._subscribers.forEach(subscriber => {
      const value = subscriber.selector(this._state);
      const newValue = subscriber.selector(newState);
      if (value !== newValue) {
        subscribersToNotify.push(subscriber);
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
  new (...args: any): DomainContext<TState>;
}
