import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider, UiContextProvider } from 'react-neon';

import initialize from './initialize';
import { CounterView } from './CounterView';

const { app, counterUi } = initialize();

const App: React.FC = () => {
  return (
    <AppProvider app={app}>
      <div>
        <h2>Hello Neon!</h2>
        <UiContextProvider uiContext={counterUi}>
          <CounterView />
        </UiContextProvider>
      </div>
    </AppProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
