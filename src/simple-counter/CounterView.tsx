import React from 'react';
import { useDomainContext } from 'react-neon';
import { DomainContext } from 'neon';

import { Counter } from './state';

export const CounterView: React.FC = () => {
  const value = useDomainContext<Counter>(DomainContext);

  return (
    <div>
      <span>Count: {value}</span>
      <button>Increment</button>
      <button>Decrement</button>
    </div>
  );
};
