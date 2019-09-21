import React from 'react';
import { render } from '@testing-library/react';
import { TestModule } from 'neon/test-utilities';

import { createModuleContext } from './module';

describe('Module', () => {
  describe('createModuleContext', () => {
    it('can provide and use the created module', () => {
      const testModule = new TestModule('test');
      const moduleContext = createModuleContext(testModule);

      const ModuleId = () => {
        const mod = moduleContext.useModule();
        return <div>{mod.id}</div>;
      };

      const component = render(
        <moduleContext.ModuleProvider>
          <ModuleId />
        </moduleContext.ModuleProvider>,
      );

      expect(component.queryByText(testModule.id)).toBeDefined();
    });

    it('can create and use a new context', () => {
      const testModule = new TestModule('test');
      const moduleContext = createModuleContext(testModule);

      const ContextId = () => {
        const context = moduleContext.useContext();
        return <div>{context.id}</div>;
      };

      const component = render(
        <moduleContext.ModuleProvider>
          <moduleContext.NewContextContainer>
            <ContextId />
          </moduleContext.NewContextContainer>
        </moduleContext.ModuleProvider>,
      );

      expect(component.queryByText(testModule.contexts[0].id)).toBeDefined();
    });

    it('can create and use multiple new context', () => {
      const testModule = new TestModule('test');
      const moduleContext = createModuleContext(testModule);

      const ContextId = () => {
        const context = moduleContext.useContext();
        return <div>{context.id}</div>;
      };

      const component = render(
        <moduleContext.ModuleProvider>
          <moduleContext.NewContextContainer>
            <ContextId />
          </moduleContext.NewContextContainer>
          <moduleContext.NewContextContainer>
            <ContextId />
          </moduleContext.NewContextContainer>
          <moduleContext.NewContextContainer>
            <ContextId />
          </moduleContext.NewContextContainer>
        </moduleContext.ModuleProvider>,
      );

      testModule.contexts.forEach(context =>
        expect(component.queryByText(context.id)).toBeDefined(),
      );
    });
  });
});
