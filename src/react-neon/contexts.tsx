import React, { MutableRefObject } from 'react';
import { NeonApp, NeonUiContext } from 'neon';

export const AppContext = React.createContext<NeonApp>(new NeonApp(''));

export interface AppProviderProps {
  app: NeonApp;
}

export const AppProvider: React.FC<AppProviderProps> = ({ app, children }) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

export const UiContext = React.createContext<NeonUiContext>(new NeonUiContext(''));

export interface UiContextContainerProps {
  uiContext: NeonUiContext;
  style?: React.CSSProperties;
  children: React.ReactElement<{ id: string }>;
}

export const UiContextContainer = ({ uiContext, style, children }: UiContextContainerProps) => {
  const containerRef = React.useRef() as MutableRefObject<HTMLDivElement>;

  const handleKeyPress = (e: KeyboardEvent) => {
    uiContext.tryHandleKeyCode(e.key);
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
    <UiContext.Provider value={uiContext}>
      <div ref={containerRef} style={style} tabIndex={-1}>
        {children}
      </div>
    </UiContext.Provider>
  );
};
