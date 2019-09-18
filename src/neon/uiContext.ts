import { Command } from './command';
import { DomainContext, DomainContextType } from './domainContext';

export interface Keybinding {
  keyCode: string;
  command: Command<any, any>;
}

export interface UiContext {
  readonly id: string;
  readonly domainContexts: DomainContext<any>[];
  readonly keybindings: Keybinding[];
  readonly registerKeybinding: (keybinding: Keybinding) => void;
  readonly attachDomainContext: (context: DomainContext<any>) => void;
  readonly detachDomainContext: (id: string) => void;
  readonly tryHandleKeyCode: (keyCode: string) => boolean;
}

export class NeonUiContext implements UiContext {
  private _childContexts: Record<string, NeonUiContext> = {};
  private _domainContexts: Record<string, DomainContext<any>> = {};
  private _keybindings: Record<string, Keybinding> = {};

  constructor(private _id: string, private _parentUiContext?: NeonUiContext) {}

  public get id() {
    return this._id;
  }

  public get parentUiContext() {
    return this._parentUiContext;
  }

  public set parentUiContext(parent: NeonUiContext | undefined) {
    this._parentUiContext = parent;
  }

  public get domainContexts(): DomainContext<any>[] {
    return Object.values(this._domainContexts);
  }

  public get keybindings() {
    return Object.values(this._keybindings);
  }

  public addChildContext(context: NeonUiContext) {
    this._childContexts[context.id] = context;
  }

  public removeChildContext(context: NeonUiContext) {
    delete this._childContexts[context.id];
  }

  public getChildContext(id: string): NeonUiContext | undefined {
    const context = this._childContexts[id];
    if (context) {
      return context;
    }

    for (const child of Object.values(this._childContexts)) {
      const nestedChild = child.getChildContext(id);
      if (nestedChild) {
        return nestedChild;
      }
    }

    return undefined;
  }

  public registerKeybinding(keybinding: Keybinding) {
    this._keybindings[keybinding.keyCode] = keybinding;
  }

  public attachDomainContext(context: DomainContext<any>) {
    this._domainContexts[context.id] = context;
  }

  public detachDomainContext(id: string) {
    delete this._domainContexts[id];
  }

  public getDomainContext<TState>(
    type: DomainContextType<TState>
  ): DomainContext<TState> | undefined {
    return Object.values(this._domainContexts).find(context => context instanceof type);
  }

  public tryHandleKeyCode(keyCode: string): boolean {
    const keybinding = this._keybindings[keyCode];
    if (keybinding) {
      const commandContext = Object.values(this._domainContexts).find(context =>
        context.canExecuteCommand(keybinding.command)
      );

      if (commandContext) {
        commandContext.executeCommand(keybinding.command, {});
        return true;
      }
    }

    if (this.parentUiContext) {
      return this.parentUiContext.tryHandleKeyCode(keyCode);
    }

    return false;
  }
}
