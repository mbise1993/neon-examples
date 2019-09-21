import React from 'react';
import { Command, StateChangedHook, CanExecuteChangedHook } from 'neon';

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
    const hook = new StateChangedHook(selector, newValue => {
      setValue(newValue);
    });
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

  const [canExecute, setCanExecute] = React.useState(true);

  React.useEffect(() => {
    setCanExecute(provider.canExecuteCommand(command));

    const canExecuteChangedHook = new CanExecuteChangedHook<TState>(changed => {
      if (changed.id === command.id) {
        setCanExecute(provider.canExecuteCommand(command));
      }
    });

    provider.registerHook(canExecuteChangedHook);

    return () => provider.removeHook(canExecuteChangedHook);
  }, [command, provider]);

  return {
    canExecute,
    execute: () => provider.executeCommand(command),
  };
};
