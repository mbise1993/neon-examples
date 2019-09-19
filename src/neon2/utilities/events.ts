import { pull } from 'lodash';

interface Handler<TArgs> {
  (args: TArgs): void;
}

interface Dispose {
  (): void;
}

export interface Subscription<THandler extends Handler<any>> {
  readonly id: number;
  readonly handler: THandler;
  readonly dispose: Dispose;
}

export class SubscriptionManager<TEvent> {
  private _nextId = 1;
  private _subscriptions = new Map<keyof TEvent, Subscription<Handler<any>>[]>();

  public subscribe<TType extends keyof TEvent, TArgs = TEvent[TType]>(
    event: TType,
    handler: Handler<TArgs>,
  ) {
    if (!this._subscriptions.has(event)) {
      this._subscriptions.set(event, []);
    }

    const id = this._nextId;
    this._nextId++;

    const subsForEvent = this._subscriptions.get(event);
    if (!subsForEvent) {
      throw new Error(`Unsupported event: ${event}`);
    }

    const sub: Subscription<typeof handler> = {
      id,
      handler,
      dispose: () => this.unsubscribe(event, id),
    };

    subsForEvent.push(sub);
    return sub.dispose;
  }

  public unsubscribeAll() {
    for (const event of this._subscriptions.keys()) {
      const subsForEvent = this._subscriptions.get(event);
      if (subsForEvent) {
        subsForEvent.forEach(sub => this.unsubscribe(event, sub.id));
      }
    }
  }

  public fire<TType extends keyof TEvent, TArgs = TEvent[TType]>(event: TType, args: TArgs) {
    const subsForEvent = this._subscriptions.get(event);
    if (subsForEvent) {
      subsForEvent.forEach(sub => sub.handler(args));
    }
  }

  private unsubscribe<TType extends keyof TEvent>(event: TType, id: number) {
    const subsForEvent = this._subscriptions.get(event);
    if (subsForEvent) {
      pull(subsForEvent, subsForEvent.find(sub => sub.id === id));
      if (subsForEvent.length === 0) {
        this._subscriptions.delete(event);
      }
    }
  }
}
