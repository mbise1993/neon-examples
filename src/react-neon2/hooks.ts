import React from 'react';
import { Command, StateChangedHook, CanExecuteChangedHook } from 'neon2';

import { AppContext, ModuleContext } from './contexts';

export const useApp = () => {
  return React.useContext(AppContext);
};

export const useSelector = <TState, TSelected>(
  moduleContext: ModuleContext<TState>,
  selector: (state: TState) => TSelected,
): TSelected => {
  const context = moduleContext.useContext();
  const [value, setValue] = React.useState(selector(context.state));

  React.useEffect(() => {
    const hook = new StateChangedHook(selector, newValue => setValue(newValue));
    context.registerHook(hook);
    return () => context.removeHook(hook);
  }, [selector]);

  return value;
};

export interface UseCommandResult {
  readonly canExecute: boolean;
  execute(): void;
}

export const useCommand = <TState>(command: Command<TState>): UseCommandResult => {
  const app = useApp();
  const provider = app.getCommandProvider(command.id);

  const [canExecute, setCanExecute] = React.useState(provider.canExecuteCommand(command));

  React.useEffect(() => {
    const canExecuteChangedHook = new CanExecuteChangedHook<TState>(changed => {
      if (changed.id === command.id) {
        const updatedCanExecute = provider.canExecuteCommand(command);
        if (updatedCanExecute !== canExecute) {
          setCanExecute(updatedCanExecute);
        }
      }
    });

    provider.registerHook(canExecuteChangedHook);
  }, [command, provider]);

  return {
    canExecute,
    execute: () => provider.executeCommand(command),
  };
};
