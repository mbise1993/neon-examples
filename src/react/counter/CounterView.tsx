import React from 'react';
import { useSelector, useExecuteCommand } from 'react-neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export interface CounterViewProps {
  id: string;
}

export const CounterView: React.FC<CounterViewProps> = ({ id }) => {
  const value = useSelector(CounterDomainContext, state => state.value);
  const increment = useExecuteCommand(CounterDomainContext, IncrementCommand);
  const decrement = useExecuteCommand(CounterDomainContext, DecrementCommand);

  return (
    <div id={id}>
      <span>Count: {value}</span>
      <button onClick={() => increment(undefined)}>Increment</button>
      <button onClick={() => decrement(undefined)}>Decrement</button>
    </div>
  );
};
