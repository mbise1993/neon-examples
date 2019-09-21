import { Context, Command, CommandHooks, Module, ModuleHooks, StateHooks } from '..';
import { History } from '../history';
import { __config } from './config';

export const mockCommand = (id: string): Command<any> => {
  return {
    id,
    name: id,
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

export const mockCommandHooks = (): CommandHooks<any> => {
  return {
    onCanExecuteChanged: __config.mockFn(),
    onWillExecute: __config.mockFn(),
    onDidExecute: __config.mockFn(),
  };
};

export const mockModuleHooks = (): ModuleHooks<any> => {
  return {
    activeContextWillChange: __config.mockFn(),
    activeContextDidChange: __config.mockFn(),
    contextWillAttach: __config.mockFn(),
    contextDidAttach: __config.mockFn(),
    contextWillDetach: __config.mockFn(),
    contextDidDetach: __config.mockFn(),
  };
};

export const mockStateHooks = (): StateHooks<any, any> => {
  return {
    select: state => state,
    onWillChange: __config.mockFn(),
    onDidChange: __config.mockFn(),
  };
};
