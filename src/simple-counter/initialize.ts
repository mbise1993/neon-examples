import { DomainContext, NeonApp, UiContext } from 'neon';

import { Counter } from './state';
import { IncrementCommand, DecrementCommand } from './commands';

export default function initialize() {
  const counterDomain = new DomainContext<Counter>('domain.counter', { value: 0 });
  counterDomain.registerCommand(new IncrementCommand());
  counterDomain.registerCommand(new DecrementCommand());

  const counterUi = new UiContext('ui.counter');
  counterUi.addDomainContext(counterDomain);

  const app = new NeonApp();
  app.attachUiContext(counterUi);

  return { app, counterUi };
}
