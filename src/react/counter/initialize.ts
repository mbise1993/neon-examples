import { NeonApp, UiContext } from 'neon';

import { CounterDomainContext } from './contexts';
import { incrementCommand, decrementCommand } from './commands';

export default function initialize() {
  const counterDomain = new CounterDomainContext();

  const counterUi = new UiContext('ui.counter');
  counterUi.addDomainContext(counterDomain);
  counterUi.registerKeybinding({ keyCode: '=', command: incrementCommand });
  counterUi.registerKeybinding({ keyCode: '-', command: decrementCommand });

  const app = new NeonApp();
  app.attachUiContext(counterUi);

  return { app, counterUi };
}
