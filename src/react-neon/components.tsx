import React from 'react';
import { Command } from 'neon';
import { useCommand } from 'react-neon';

export interface CommandExecutorProps {
  command: Command<any>;
  children: (canExecute: boolean, execute: () => void) => React.ReactElement;
}

export const CommandExecutor: React.FC<CommandExecutorProps> = ({ command, children }) => {
  const { canExecute, execute } = useCommand(command);

  return <>{children(canExecute, execute)}</>;
};
