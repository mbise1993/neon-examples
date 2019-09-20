import React from 'react';
import { App, NeonApp, Module, Context } from 'neon2';

export const AppContext = React.createContext<App>(new NeonApp(''));

export interface AppProviderProps {
  app: App;
}

export const AppProvider: React.FC<AppProviderProps> = ({ app, children }) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

export interface ModuleContext<TState> {
  ModuleProvider: React.ComponentType;
  NewContextContainer: React.ComponentType;
  useModule: () => Module<TState>;
  useContext: () => Context<TState>;
}

export function createModuleContext<TState>(mod: Module<TState>): ModuleContext<TState> {
  const ReactModuleContext = React.createContext(mod);

  const ModuleProvider: React.FC = ({ children }) => {
    return <ReactModuleContext.Provider value={mod}>{children}</ReactModuleContext.Provider>;
  };

  const ReactContextContext = React.createContext(mod.createContext());

  const NewContextContainer: React.FC = ({ children }) => {
    const newContext = mod.createContext();
    mod.attachContext(newContext);
    mod.activateContext(newContext);

    return (
      <ReactContextContext.Provider value={newContext}>{children}</ReactContextContext.Provider>
    );
  };

  return {
    ModuleProvider,
    NewContextContainer,
    useModule: () => React.useContext(ReactModuleContext),
    useContext: () => React.useContext(ReactContextContext),
  };
}

interface ContextContainerProps<TState> extends React.HTMLProps<HTMLDivElement> {
  module: Module<TState>;
}

export function ContextContainer<TState>({
  module: mod,
  children,
  ...rest
}: ContextContainerProps<TState>) {
  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const handleKeyPress = (e: KeyboardEvent) => {
    mod.handleKeyCode(e.key);
  };

  React.useLayoutEffect(() => {
    const { current } = containerRef;
    if (!current) {
      throw new Error('Unabled to get ref container');
    }

    current.addEventListener('keypress', handleKeyPress);

    return () => current.removeEventListener('keypress', handleKeyPress);
  }, [children, handleKeyPress]);

  return (
    <div ref={containerRef} tabIndex={-1} {...rest}>
      {children}
    </div>
  );
}
