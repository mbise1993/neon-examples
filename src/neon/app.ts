import { Module } from './module';
import { Command, CommandService } from './command';
import { ServiceProvider } from './service';
import { NeonUiContext } from './uiContext';

export class NeonApp implements ServiceProvider {
  private _modules: Record<string, Module> = {};
  private _uiContexts: Record<string, NeonUiContext> = {};
  private _commandServices: CommandService<any>[] = [];

  constructor(private _name: string) {}

  public get name() {
    return this._name;
  }

  public get availableCommands() {
    return this._commandServices.reduce(
      (acc, service) => {
        acc.push(...service.commands);
        return acc;
      },
      [] as Command<any, any>[]
    );
  }

  public getService<T>(id: string) {
    Object.values(this._modules).forEach(mod => {
      const service = mod.getService<T>(id);
      if (service) {
        return service;
      }
    });

    return undefined;
  }

  public attachModule(mod: Module) {
    mod.onWillAttach && mod.onWillAttach(this);
    this._modules[mod.id] = mod;

    const commandService = mod.getService<CommandService<any>>(CommandService.id);
    if (commandService) {
      this._commandServices.push(commandService);
    }

    mod.onDidAttach && mod.onDidAttach(this);
  }

  public detachModule(id: string) {
    const mod = this._modules[id];
    mod.onWillDetach && mod.onWillDetach(this);
    delete this._modules[id];
    mod.onDidDetach && mod.onDidDetach(this);
  }

  public attachUiContext(uiContext: NeonUiContext) {
    this._uiContexts[uiContext.id] = uiContext;
  }

  public detachUiContext(id: string) {
    delete this._uiContexts[id];
  }
}