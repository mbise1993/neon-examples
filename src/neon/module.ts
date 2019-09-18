import { cloneDeep } from 'lodash';

import { NeonApp } from './app';
import { NeonServiceProvider, ServiceProvider } from './service';

export interface ModuleConfig {
  readonly id: string;
  readonly description: string;
  readonly contributes: {
    readonly ui: boolean;
    readonly commands: string[];
    readonly services: string[];
  };
}

export interface Module extends ServiceProvider {
  readonly id: string;
  readonly getUi?: () => HTMLElement | undefined;
  readonly onWillAttach?: (app: NeonApp) => void;
  readonly onDidAttach?: (app: NeonApp) => void;
  readonly onWillDetach?: (app: NeonApp) => void;
  readonly onDidDetach?: (app: NeonApp) => void;
}

export class NeonModule<TState> extends NeonServiceProvider {
  private _state: TState;

  constructor(private _id: string, initialState: TState) {
    super();
    this._state = cloneDeep(initialState);
  }

  public get id() {
    return this._id;
  }

  public getUi() {
    return undefined;
  }

  public getState() {
    return this._state;
  }
}
