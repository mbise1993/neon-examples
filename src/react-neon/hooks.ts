import React from 'react';
import { ServiceType, Command, CommandArgsType, DomainContext, DomainContextType } from 'neon';

import { AppContext, UiContext } from './contexts';

export const useApp = () => {
  return React.useContext(AppContext);
};

export const useUiContext = () => {
  return React.useContext(UiContext);
};

export const useDomainContext = <TState>(
  contextType: DomainContextType<TState>,
): DomainContext<TState> => {
  const uiContext = useUiContext();
  const domainContext = uiContext.getDomainContext(contextType);
  if (!domainContext) {
    throw new Error(`UiContext '${uiContext.id}' does not contain matching DomainContext'`);
  }

  return domainContext;
};

export const useSelector = <TState, TSelected>(
  contextType: DomainContextType<TState>,
  selector: (state: TState) => TSelected,
): TSelected => {
  const domainContext = useDomainContext(contextType);
  const [value, setValue] = React.useState(selector(domainContext.state));

  React.useEffect(() => {
    domainContext.subscribe(selector, newValue => setValue(newValue));
  }, [selector]);

  return value;
};

export const useService = <TState, TService extends ServiceType>(
  contextType: DomainContextType<TState>,
  serviceType: TService,
): TService => {
  const domainContext = useDomainContext(contextType);
  const service = domainContext.getService(serviceType);
  if (!service) {
    throw new Error(`DomainContext does not provider Service of type '${serviceType}'`);
  }

  return service;
};

export interface UseCommandResult<TCommand extends Command<any, any>> {
  canExecute: () => boolean;
  execute: (args: CommandArgsType<TCommand>) => void;
}

export const useCommand = <TState, TCommand extends Command<any, any>>(
  contextType: DomainContextType<TState>,
  commandType: TCommand,
): UseCommandResult<TCommand> => {
  const domainContext = useDomainContext(contextType);

  return {
    canExecute: () => domainContext.canExecuteCommand(commandType),
    execute: (args: CommandArgsType<TCommand>) => domainContext.executeCommand(commandType, args),
  };
};
