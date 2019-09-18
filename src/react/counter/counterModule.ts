import { Module, CommandService, NeonUiContext, UiContext, Service, NeonApp } from 'neon';

import { incrementCommand, decrementCommand } from './commands';
import { Counter } from './state';

export class CounterModule implements Module {
  private _id = 'module.counter';
  private _services: Record<string, Service> = {};
  private _uiContexts: UiContext[] = [];

  constructor() {
    this.registerServices();
  }

  public get id() {
    return this._id;
  }

  public getService<T extends Service>(id: string) {
    const service = this._services[id];
    return service ? (service as T) : undefined;
  }

  public onDidAttach(app: NeonApp) {
    const uiContext = new NeonUiContext('uiContext.counter');
    this._uiContexts.push(uiContext);
    app.attachUiContext(uiContext);
  }

  private registerServices() {
    const commandService = new CommandService<Counter>();
    commandService.register(incrementCommand);
    commandService.register(decrementCommand);

    this._services[commandService.id] = commandService;
  }
}
