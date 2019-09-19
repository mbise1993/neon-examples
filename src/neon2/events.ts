import { pull } from 'lodash';

interface Handler<TArgs> {
  (args: TArgs): void;
}

interface Dispose {
  (): void;
}

export interface Subscription<TEvent extends Event<any>> {
  readonly id: number;
  readonly handler: Handler<TEvent['args']>;
  readonly dispose: Dispose;
}

export interface Event<TArgs> {
  readonly type: string;
  readonly args: TArgs;
}

export class SubscriptionManager<TEvent extends Event<any>> {
  private _nextId = 1;
  private _subscriptions = new Map<TEvent['type'], Subscription<TEvent>[]>();

  public subscribe<TType extends TEvent['type'], TArgs extends TEvent['args']>(
    event: TType,
    handler: Handler<TArgs>,
  ) {
    if (!this._subscriptions.has(event)) {
      this._subscriptions.set(event, []);
    }

    const id = this._nextId;
    this._nextId++;

    const subsForEvent = this._subscriptions.get(event);
    if (subsForEvent) {
      subsForEvent.push({
        id,
        handler,
        dispose: () => this.unsubscribe(event, id),
      });
    }
  }

  public unsubscribeAll() {
    for (const event of this._subscriptions.keys()) {
      const subsForEvent = this._subscriptions.get(event);
      if (subsForEvent) {
        subsForEvent.forEach(sub => this.unsubscribe(event, sub.id));
      }
    }
  }

  public fire<TType extends TEvent['type'], TArgs extends TEvent['args']>(
    event: TType,
    args: TArgs,
  ) {
    const subsForEvent = this._subscriptions.get(event);
    if (subsForEvent) {
      subsForEvent.forEach(sub => sub.handler(args));
    }
  }

  private unsubscribe(event: TEvent['type'], id: number) {
    const subsForEvent = this._subscriptions.get(event);
    if (subsForEvent) {
      pull(subsForEvent, subsForEvent.find(sub => sub.id === id));
      if (subsForEvent.length === 0) {
        this._subscriptions.delete(event);
      }
    }
  }
}
