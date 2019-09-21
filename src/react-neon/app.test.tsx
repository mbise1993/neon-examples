import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { NeonApp } from 'neon';

import { AppContext, AppProvider, useApp } from './app';

describe('App', () => {
  describe('AppProvider', () => {
    it('can provide the given app', () => {
      const AppName = () => {
        const app = React.useContext(AppContext);
        return <div>{app.name}</div>;
      };

      const app = new NeonApp('test');
      const component = render(
        <AppProvider app={app}>
          <AppName />
        </AppProvider>,
      );

      expect(component.queryByText('test')).toBeDefined();
    });
  });

  describe('useApp', () => {
    it('returns the provided app', () => {
      const app = new NeonApp('test');
      const wrapper: React.FC = ({ children }) => <AppProvider app={app}>{children}</AppProvider>;
      const hook = renderHook(() => useApp(), { wrapper });

      expect(hook.result.current).toBe(app);
    });
  });
});
