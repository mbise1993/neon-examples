import React from 'react';
import ReactDOM from 'react-dom';
import { UiContextContainer } from 'react-neon';

import { AppContainer } from '../shared/AppContainer';
import initialize from './initialize';
import { CounterView } from './CounterView';

const { app, counterUi } = initialize();

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
