import { NeonApp } from './app';

import { CounterContext } from './testUtil';

describe(NeonApp.name, () => {
  it('can attach and detach Context', () => {
    const app = new NeonApp('Test');
    const context = new CounterContext();
    app.attachContext(context);
    expect(app.getContext(context)).toBeTruthy();

    app.detachContext(context);
    expect(app.getContext(context)).toBeTruthy();
  });

  it('can activate context', () => {
    const app = new NeonApp('Test');
    const context1 = new CounterContext();
    const context2 = new CounterContext();
    app.attachContext(context1);
    app.attachContext(context2);

    app.activateContext(context1);
    expect(app.activeContext).toBe(context1);
  });
});
