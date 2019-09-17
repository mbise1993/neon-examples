import React from 'react';
import { useSelector, useCommand } from 'react-neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export const CounterView: React.FC = () => {
  const value = useSelector(CounterDomainContext, state => state.value);
  const increment = useCommand(CounterDomainContext, IncrementCommand);
  const decrement = useCommand(CounterDomainContext, DecrementCommand);

  return (
    <div>
      <span>Count: {value}</span>
      <button disabled={!increment.canExecute()} onClick={() => increment.execute(undefined)}>
        Increment
      </button>
      <button disabled={!decrement.canExecute()} onClick={() => decrement.execute(undefined)}>
        Decrement
      </button>
    </div>
  );
};
