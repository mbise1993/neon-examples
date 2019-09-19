import React from 'react';
import { Command, CommandArgsType, Context } from 'neon';

import { AppContext } from './contexts';

export const useApp = () => {
  return React.useContext(AppContext);
};

export const useSelector = <TState, TSelected>(
  context: Context<TState>,
  selector: (state: TState) => TSelected,
): TSelected => {
  const [value, setValue] = React.useState(selector(context.state));

  React.useEffect(() => {
    const dispose = context.onStateChange(selector, newValue => setValue(newValue));
    return () => dispose();
  }, [selector]);

  return value;
};

export interface UseCommandResult<TCommand extends Command<any, any>> {
  canExecute: () => boolean;
  execute: (args: CommandArgsType<TCommand>) => void;
}

export const useCommand = <C extends Command<any, any>>(command: C): UseCommandResult<C> => {
  const app = useApp();

  const canExecute = (): boolean => {
    return !!app.activeContext && app.activeContext.canHandleCommand(command);
  };

  const execute = (args: CommandArgsType<C>) => {
    app.activeContext && app.activeContext.executeCommand(command, args);
  };

  return {
    canExecute,
    execute,
  };
};
