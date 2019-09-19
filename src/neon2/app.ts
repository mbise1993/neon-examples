import { Context } from 'neon/context';

export class NeonApp {
  private _contexts: Record<string, Context<any>> = {};
  private _activeContext?: Context<any>;

  constructor(private _name: string) {}

  public get name() {
    return this._name;
  }

  public get activeContext() {
    return this._activeContext;
  }

  public attachContext(context: Context<any>) {
    this._contexts[context.id] = context;
  }

  public detachContext(context: Context<any>) {
    delete this._contexts[context.id];
  }

  public activateContext(context: Context<any>) {
    if (!this._contexts[context.id]) {
      throw new Error(`Context '${context.id}' has not been attached`);
    }

    this._activeContext = context;
  }
}
