import { pull } from 'lodash';

export interface HooksProvider<THooks> {
  registerHook(hook: THooks): void;
  removeHook(hook: THooks): void;
}

export class Hooks<THook extends object> {
  private _hooks: THook[] = [];

  public register(hook: THook) {
    this._hooks.push(hook);
  }

  public remove(hook: THook) {
    pull(this._hooks, hook);
  }

  public invoke<TName extends keyof THook, TFunc = THook[TName]>(
    name: TName,
    args: TFunc extends (...args: any) => any ? Parameters<TFunc> : never,
  ) {
    for (const hook of this._hooks) {
      const method = hook[name];
      if (method instanceof Function) {
        method.apply(hook, args);
      }
    }
  }
}
