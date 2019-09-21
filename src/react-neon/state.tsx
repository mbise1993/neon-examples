import React from 'react';
import { StateChangedHook } from 'neon';

import { ModuleContext } from './module';

export const useSelector = <TState, TSelected>(
  moduleContext: ModuleContext<TState>,
  selector: (state: TState) => TSelected,
): TSelected => {
  const context = moduleContext.useContext();
  const [value, setValue] = React.useState(selector(context.state));

  React.useEffect(() => {
    const hook = new StateChangedHook(selector, newValue => {
      setValue(newValue);
    });
    context.registerHook(hook);
    return () => context.removeHook(hook);
  }, [selector]);

  return value;
};
