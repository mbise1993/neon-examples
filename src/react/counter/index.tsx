import React from 'react';
import ReactDOM from 'react-dom';
import { NeonApp, AppProvider } from 'react-neon';

import { counterModule, CounterContext } from './counterModule';
import { AppContainer } from '../shared/AppContainer';
import { CounterView } from './CounterView';

const app = new NeonApp('Neon Counter');
app.attachModule(counterModule);

const App: React.FC = () => {
  return (
    <AppProvider app={app}>
      <AppContainer>
        <CounterContext.ModuleProvider>
          <CounterContext.NewContextContainer>
            <CounterView />
          </CounterContext.NewContextContainer>
        </CounterContext.ModuleProvider>
      </AppContainer>
    </AppProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
