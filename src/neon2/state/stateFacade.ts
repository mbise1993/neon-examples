import { cloneDeep, merge } from 'lodash';

import { SubscriptionManager } from '../utilities/events';
import { Selector } from './interfaces';

export interface StateEvents<TState> {
  WILL_UPDATE: {
    readonly state: TState;
  };
  DID_UPDATE: {
    readonly oldState: TState;
    readonly newState: TState;
  };
}

export class StateFacade<TState> {
  private _state: TState;
  private _subscriptions = new SubscriptionManager<StateEvents<TState>>();

  constructor(initialState: TState) {
    this._state = cloneDeep(initialState);
  }

  public select<TSelected>(selector: Selector<TState, TSelected>) {
    return selector(this._state);
  }

  public update(newState: Partial<TState>) {
    this._state = merge(this._state, newState);
  }

  public subscribe<TSelected>(
    selector: Selector<TState, TSelected>,
    handler: (value: TSelected) => void,
  ) {
    return this._subscriptions.subscribe('DID_UPDATE', args => {
      const oldValue = selector(args.oldState);
      const newValue = selector(args.newState);
      if (oldValue !== newValue) {
        handler(newValue);
      }
    });
  }
}
