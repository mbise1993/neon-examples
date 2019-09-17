import React from 'react';
import { Box, Card, IconButton, Typography } from '@material-ui/core';
import IncrementIcon from '@material-ui/icons/Add';
import DecrementIcon from '@material-ui/icons/Remove';
import { useSelector, useCommand } from 'react-neon';

import { CounterDomainContext } from './contexts';
import { IncrementCommand, DecrementCommand } from './commands';

export const CounterView: React.FC = () => {
  const value = useSelector(CounterDomainContext, state => state.value);
  const increment = useCommand(CounterDomainContext, IncrementCommand);
  const decrement = useCommand(CounterDomainContext, DecrementCommand);

  return (
    <Card>
      <Box display="flex" alignItems="center" padding={2}>
        <Typography>Count: {value}</Typography>
        <Box marginLeft={1}>
          <IconButton
            disabled={!decrement.canExecute()}
            onClick={() => decrement.execute(undefined)}
          >
            <DecrementIcon />
          </IconButton>
        </Box>
        <Box marginLeft={1}>
          <IconButton
            disabled={!increment.canExecute()}
            onClick={() => increment.execute(undefined)}
          >
            <IncrementIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
