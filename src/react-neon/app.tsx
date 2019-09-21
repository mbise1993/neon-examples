import React from 'react';
import { App, NeonApp } from 'neon';

export const AppContext = React.createContext<App>(new NeonApp(''));

export interface AppProviderProps {
  app: App;
}

export const AppProvider: React.FC<AppProviderProps> = ({ app, children }) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  return React.useContext(AppContext);
};
