export interface Selector<TState, TSelected> {
  (state: TState): TSelected;
}

export interface StateProvider<TState> {
  readonly state: TState;
}

export interface StateHooks<TState, TSelected> {
  select(state: TState): TSelected;
  readonly willChange?: (value: TSelected, nextValue: TSelected) => void;
  readonly didChange?: (value: TSelected, previousValue: TSelected) => void;
}

export class StateChangedHook<TState, TSelected> implements StateHooks<TState, TSelected> {
  constructor(
    private _selector: StateHooks<TState, TSelected>['select'],
    private _handler: Required<StateHooks<TState, TSelected>>['didChange'],
  ) {}

  public select(state: TState) {
    return this._selector(state);
  }

  public didChange(value: TSelected, previousValue: TSelected) {
    this._handler(value, previousValue);
  }
}
