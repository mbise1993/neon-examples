export interface Selector<TState, TSelected> {
  (state: TState): TSelected;
}
