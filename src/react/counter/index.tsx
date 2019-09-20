import React from 'react';
import ReactDOM from 'react-dom';
import { NeonApp } from 'neon2';

import { counterModule, CounterContext } from './counterModule';
import { AppContainer } from '../shared/AppContainer';
import { CounterView } from './CounterView';

const app = new NeonApp('Neon Counter');
app.attachModule(counterModule);

const App: React.FC = () => {
  return (
    <AppContainer app={app}>
      <CounterContext.ModuleProvider>
        <CounterContext.NewContextContainer>
          <CounterView />
        </CounterContext.NewContextContainer>
      </CounterContext.ModuleProvider>
    </AppContainer>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
