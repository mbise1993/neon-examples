import React from 'react';
import { Command, CanExecuteChangedHook } from 'neon';

import { useApp } from './app';

export interface UseCommandResult {
  readonly canExecute: boolean;
  execute(): void;
}

export function useCommand<TState>(command: Command<TState>): UseCommandResult {
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
}

export interface CommandExecutorProps {
  command: Command<any>;
  children: (canExecute: boolean, execute: () => void) => React.ReactElement;
}

export const CommandExecutor: React.FC<CommandExecutorProps> = ({ command, children }) => {
  const { canExecute, execute } = useCommand(command);

  return <>{children(canExecute, execute)}</>;
};
