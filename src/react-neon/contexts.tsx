import React from 'react';
import { NeonApp, Context } from 'neon';

export const AppContext = React.createContext<NeonApp>(new NeonApp(''));

export interface AppProviderProps {
  app: NeonApp;
}

export const AppProvider: React.FC<AppProviderProps> = ({ app, children }) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

interface NeonContextContainerProps<TState> extends React.HTMLProps<HTMLDivElement> {
  readonly context: Context<TState>;
}

function NeonContextContainer<TState>({
  context,
  children,
  ...rest
}: NeonContextContainerProps<TState>) {
  const app = React.useContext(AppContext);
  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

  const handleKeyPress = (e: KeyboardEvent) => {
    app.handleKeyCode(e.key);
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

export interface NeonContext<TState> {
  Container: React.ComponentType<React.HTMLProps<HTMLDivElement>>;
  useContext(): Context<TState>;
}

export function createNeonContext<TState>(context: Context<TState>): NeonContext<TState> {
  const ReactContext = React.createContext(context);

  const Container: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, ...rest }) => {
    return (
      <ReactContext.Provider value={context}>
        <NeonContextContainer<TState> context={context} {...rest}>
          {children}
        </NeonContextContainer>
      </ReactContext.Provider>
    );
  };

  return {
    Container,
    useContext: () => React.useContext(ReactContext),
  };
}
