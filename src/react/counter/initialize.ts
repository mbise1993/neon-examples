import { NeonApp, UiContext } from 'neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export default function initialize() {
  const counterDomain = new CounterDomainContext();

  const counterUi = new UiContext('ui.counter');
  counterUi.addDomainContext(counterDomain);
  counterUi.registerKeybinding({ keyCode: '=', command: IncrementCommand });
  counterUi.registerKeybinding({ keyCode: '-', command: DecrementCommand });

  const app = new NeonApp();
  app.attachUiContext(counterUi);
  app.attachDomainContext(counterDomain);

  return { app, counterUi };
}
