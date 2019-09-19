export interface Subscription<TData> {
  readonly data: TData;
  readonly dispose: () => void;
}

export class EventEmitter<TData> {
  private _nextSubscriptionId = 1;
  private _subscriptions: Record<string, Subscription<TData>> = {};

  public get subscriptions() {
    return Object.values(this._subscriptions);
  }

  public subscribe(data: TData) {
    const id = this._nextSubscriptionId;
    this._nextSubscriptionId++;

    const subscription: Subscription<TData> = {
      data,
      dispose: () => delete this._subscriptions[id],
    };

    this._subscriptions[id] = subscription;
    return subscription.dispose;
  }

  public unsubscribeAll() {
    this._subscriptions = {};
  }
}
