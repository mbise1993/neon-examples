import { uniqBy } from 'lodash';

import { Context } from './context';
import { Command, CommandArgsType } from './command';

export class NeonApp {
  private _contexts: Record<string, Context<any>> = {};
  private _activeContext?: Context<any>;

  constructor(private _name: string) {}

  public get name() {
    return this._name;
  }

  public get commands() {
    const allCommands = Object.values(this._contexts).reduce(
      (arr, context) => {
        arr.push(...context.commands);
        return arr;
      },
      [] as Command<any, any>[],
    );

    return uniqBy(allCommands, command => command.id);
  }

  public get activeContext() {
    return this._activeContext;
  }

  public executeCommand<C extends Command<any, any>>(command: C, args: CommandArgsType<C>) {
    if (this.activeContext) {
      this.activeContext.executeCommand(command, args);
    }
  }

  public attachContext(context: Context<any>) {
    context.onWillAttach && context.onWillAttach(this);
    this._contexts[context.id] = context;
    context.onDidAttach && context.onDidAttach(this);
    this.activateContext(context);
  }

  public detachContext(context: Context<any>) {
    context.onWillDetach && context.onWillDetach(this);
    delete this._contexts[context.id];
    context.onDidDetach && context.onDidDetach(this);
  }

  public getContext(context: Context<any>) {
    return this._contexts[context.id];
  }

  public activateContext(context: Context<any>) {
    this._activeContext = context;
  }

  public handleKeyCode(keyCode: string) {
    const commandToExecute = this.commands.find(command => command.keybinding === keyCode);
    if (commandToExecute) {
      this.executeCommand(commandToExecute, {});
    }
  }
}
