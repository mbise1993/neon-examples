import React from 'react';
import ReactDOM from 'react-dom';
import { UiContextContainer } from 'react-neon';
import { NeonApp } from 'neon';

import { CounterModule } from './counterModule';
import { AppContainer } from '../shared/AppContainer';
import { CounterView } from './CounterView';

const app = new NeonApp('Neon Counter');
app.attachModule(new CounterModule());

const App: React.FC = () => {
  return (
    <AppContainer app={app} name={'Neon Counter'}>
      <UiContextContainer uiContext={counterUi}>
        <CounterView />
      </UiContextContainer>
    </AppContainer>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
