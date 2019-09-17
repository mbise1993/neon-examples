import { NeonApp, UiContext } from 'neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export default function initialize() {
  const counterUi = new UiContext('ui.counter');
  counterUi.addDomainContext(new CounterDomainContext());
  counterUi.registerKeybinding({ keyCode: '=', command: IncrementCommand });
  counterUi.registerKeybinding({ keyCode: '-', command: DecrementCommand });

  const app = new NeonApp();
  app.attachUiContext(counterUi);

  return { app, counterUi };
}
