import { NeonApp } from './app';
import { NeonUiContext } from './uiContext';

describe(NeonApp.name, () => {
  it('can attach and detach UiContext', () => {
    const app = new NeonApp();
    const context = new NeonUiContext('test-ui-context');
    app.attachUiContext(context);

    expect(context.parentUiContext).toBeTruthy();
    expect((context.parentUiContext as NeonUiContext).id).toBe(app.uiContext.id);

    app.detachUiContext(context);
    expect(context.parentUiContext).toBeUndefined();
  });

  it('can set active UiContext', () => {
    const app = new NeonApp();
    const context1 = new NeonUiContext('test-ui-context-1');
    const context2 = new NeonUiContext('test-ui-context-2');
    app.attachUiContext(context1);
    app.attachUiContext(context2);

    app.activeUiContext = context1;
    expect(app.activeUiContext).toBe(context1);

    app.activeUiContext = context2;
    expect(app.activeUiContext).toBe(context2);
  });
});
