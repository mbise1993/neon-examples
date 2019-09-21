import React from 'react';
import { Module, Context } from 'neon';

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

  const NewContextContainer: React.FC<React.HTMLProps<HTMLDivElement>> = ({
    children,
    ...rest
  }) => {
    const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const newContext = mod.createContext();
    mod.attachContext(newContext);
    mod.activateContext(newContext);

    React.useLayoutEffect(() => {
      const { current } = containerRef;
      if (!current) {
        throw new Error('Unabled to get ref container');
      }

      const handleKeyPress = (e: KeyboardEvent) => {
        mod.handleKeyCode(e.key);
      };

      current.addEventListener('keypress', handleKeyPress);

      return () => current.removeEventListener('keypress', handleKeyPress);
    }, [children]);

    return (
      <ReactContextContext.Provider value={newContext}>
        <div ref={containerRef} tabIndex={-1} {...rest}>
          {children}
        </div>
      </ReactContextContext.Provider>
    );
  };

  return {
    ModuleProvider,
    NewContextContainer,
    useModule: () => React.useContext(ReactModuleContext),
    useContext: () => React.useContext(ReactContextContext),
  };
}
