import React from 'react';
import { render } from '@testing-library/react';
import { NeonApp } from 'neon';

import { AppContext, AppProvider } from './contexts';

const AppName = () => {
  const app = React.useContext(AppContext);
  return <div>{app.name}</div>;
};

describe('AppProvider', () => {
  it('can provide the given app', () => {
    const app = new NeonApp('test');
    const { queryByText } = render(
      <AppProvider app={app}>
        <AppName />
      </AppProvider>,
    );

    expect(queryByText('test')).toBeDefined();
  });
});
