import React from 'react';
import { useSelector, useExecuteCommand } from 'react-neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export const CounterView: React.FC = () => {
  const value = useSelector(CounterDomainContext, state => state.value);
  const increment = useExecuteCommand(CounterDomainContext, IncrementCommand);
  const decrement = useExecuteCommand(CounterDomainContext, DecrementCommand);

  return (
    <div>
      <span>Count: {value}</span>
      <button onClick={() => increment(undefined)}>Increment</button>
      <button onClick={() => decrement(undefined)}>Decrement</button>
    </div>
  );
};
