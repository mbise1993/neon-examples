import { Context, Command, CommandHooks, Module, ModuleHooks, StateHooks } from '..';
import { History } from '../history';
import { __config } from './config';

export const mockCommand = (id: string, keybinding?: string): Command<any> => {
  return {
    id,
    name: id,
    keybinding,
    requeryOnChange: [],
    canExecute: __config.mockFn(() => true),
    execute: __config.mockFn(),
  };
};

export const mockContext = <TState>(id: string, state: TState): Context<TState> => {
  return {
    id,
    state,
    history: new History({ state }, 10),
    canExecute: __config.mockFn(),
    execute: __config.mockFn(),
    registerHook: __config.mockFn(),
    removeHook: __config.mockFn(),
  };
};

export const mockModule = (id: string, providedCommands: Command<any>[] = []): Module<any> => {
  return {
    id,
    contexts: [],
    activeContext: undefined,
    providedCommands,
    createContext: __config.mockFn(),
    attachContext: __config.mockFn(),
    detachContext: __config.mockFn(),
    activateContext: __config.mockFn(),
    canExecuteCommand: __config.mockFn(),
    executeCommand: __config.mockFn(),
    canHandleKeyCode: __config.mockFn(),
    handleKeyCode: __config.mockFn(),
    registerHook: __config.mockFn(),
    removeHook: __config.mockFn(),
  };
};

interface CommandHooksMock extends CommandHooks<any> {
  readonly canExecuteChangedImpl: () => void;
  readonly willExecuteImpl: () => void;
  readonly didExecuteImpl: () => void;
}

export const mockCommandHooks = (): CommandHooksMock => {
  const impls = {
    canExecuteChangedImpl: __config.mockFn(),
    willExecuteImpl: __config.mockFn(),
    didExecuteImpl: __config.mockFn(),
  };

  return {
    ...impls,
    canExecuteChanged: command => impls.canExecuteChangedImpl(command),
    willExecute: (context, command) => impls.willExecuteImpl(context, command),
    didExecute: (context, command) => impls.didExecuteImpl(context, command),
  };
};

interface ModuleHooksMock extends ModuleHooks<any> {
  readonly willActivateContextImpl: () => void;
  readonly didActivateContextImpl: () => void;
  readonly willAttachContextImpl: () => void;
  readonly didAttachContextImpl: () => void;
  readonly willDetachContextImpl: () => void;
  readonly didDetachContextImpl: () => void;
}

export const mockModuleHooks = (): ModuleHooksMock => {
  const impls = {
    willActivateContextImpl: __config.mockFn(),
    didActivateContextImpl: __config.mockFn(),
    willAttachContextImpl: __config.mockFn(),
    didAttachContextImpl: __config.mockFn(),
    willDetachContextImpl: __config.mockFn(),
    didDetachContextImpl: __config.mockFn(),
  };

  return {
    ...impls,
    willActivateContext: (current, next) => impls.willActivateContextImpl(current, next),
    didActivateContext: context => impls.didActivateContextImpl(context),
    willAttachContext: context => impls.willAttachContextImpl(context),
    didAttachContext: context => impls.didAttachContextImpl(context),
    willDetachContext: context => impls.willDetachContextImpl(context),
    didDetachContext: context => impls.didDetachContextImpl(context),
  };
};

interface StateHooksMock extends StateHooks<any, any> {
  readonly willChangeImpl: () => void;
  readonly didChangeImpl: () => void;
}

export const mockStateHooks = (): StateHooksMock => {
  const impls = {
    willChangeImpl: __config.mockFn(),
    didChangeImpl: __config.mockFn(),
  };

  return {
    ...impls,
    select: state => state,
    willChange: (value, next) => impls.willChangeImpl(value, next),
    didChange: (value, previous) => impls.didChangeImpl(value, previous),
  };
};
