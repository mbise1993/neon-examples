import React from 'react';
import { Command, StateChangedHook } from 'neon2';

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
  canExecute(): boolean;
  execute(): void;
}

export const useCommand = <TState>(command: Command<TState>): UseCommandResult => {
  const app = useApp();

  const canExecute = () => true;

  const execute = () => app.executeCommandById(command.id);

  return {
    canExecute,
    execute,
  };
};
