import { NeonApp, UiContext } from 'neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export default function initialize() {
  const counterDomain = new CounterDomainContext();
  counterDomain.registerCommand(new IncrementCommand());
  counterDomain.registerCommand(new DecrementCommand());

  const counterUi = new UiContext('ui.counter');
  counterUi.addDomainContext(counterDomain);

  const app = new NeonApp();
  app.attachUiContext(counterUi);

  return { app, counterUi };
}
