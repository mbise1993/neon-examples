export interface Context<TState> {
  readonly id: string;
  readonly handlesCommands: string[];
  readonly state: TState;
}
