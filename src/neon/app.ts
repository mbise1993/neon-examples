import { Module } from './module';
import { Command } from './command';

export interface App {
  readonly name: string;
  readonly modules: Module<any>[];
  readonly providedCommands: Command<any>[];
  attachModule(module: Module<any>): void;
  detachModule(module: Module<any>): void;
  getCommandProvider(commandId: string): Module<any>;
  executeCommandById(commandId: string): void;
}

export interface ProvidedCommand {
  readonly module: Module<any>;
  readonly command: Command<any>;
}

export class NeonApp implements App {
  private _modules: Record<string, Module<any>> = {};
  private _providedCommands: Record<string, ProvidedCommand> = {};

  constructor(private _name: string) {}

  public get name() {
    return this._name;
  }

  public get modules() {
    return Object.values(this._modules);
  }

  public get providedCommands() {
    return Object.values(this._providedCommands).map(provided => provided.command);
  }

  public attachModule(mod: Module<any>) {
    if (this._modules[mod.id]) {
      throw new Error(`Module with ID '${mod.id}' already attached`);
    }

    mod.onWillAttach && mod.onWillAttach(this);

    this._modules[mod.id] = mod;
    mod.providedCommands.forEach(command => {
      this._providedCommands[command.id] = {
        module: mod,
        command,
      };
    });

    mod.onDidAttach && mod.onDidAttach(this);
  }

  public detachModule(mod: Module<any>) {
    if (!this._modules[mod.id]) {
      throw new Error(`No module with ID '${mod.id}' has been attached`);
    }

    mod.onWillDetach && mod.onWillDetach(this);

    mod.providedCommands.forEach(info => delete this._providedCommands[info.id]);
    delete this._modules[mod.id];

    mod.onDidDetach && mod.onDidDetach(this);
  }

  public getCommandProvider(commandId: string) {
    const provider = this._providedCommands[commandId];
    if (!provider) {
      throw new Error(`No provider registered for command with ID '${commandId}'`);
    }

    return provider.module;
  }

  public executeCommandById(commandId: string) {
    const provided = this._providedCommands[commandId];
    if (!provided) {
      throw new Error(`Command with ID '${commandId}' not provided by any attached modules`);
    }

    provided.module.executeCommand(provided.command);
  }
}
