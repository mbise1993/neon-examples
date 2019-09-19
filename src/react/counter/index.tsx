import React from 'react';
import ReactDOM from 'react-dom';
import { NeonApp } from 'neon';

import { counterContext, CounterContext } from './counterContext';
import { AppContainer } from '../shared/AppContainer';
import { CounterView } from './CounterView';

const app = new NeonApp('Neon Counter');
app.attachContext(counterContext);

const App: React.FC = () => {
  return (
    <AppContainer app={app}>
      <CounterContext.Container>
        <CounterView />
      </CounterContext.Container>
    </AppContainer>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
