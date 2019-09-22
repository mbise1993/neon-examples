import React from 'react';
import { Box, Card, IconButton, Typography } from '@material-ui/core';
import IncrementIcon from '@material-ui/icons/Add';
import DecrementIcon from '@material-ui/icons/Remove';
import { useSelector, useCommand } from '@neon-js/react';

import { CounterContext } from './counterModule';
import { CounterCommands } from './counterCommands';

export const CounterView: React.FC = () => {
  const value = useSelector(CounterContext, state => state.value);
  const increment = useCommand(CounterCommands.increment);
  const decrement = useCommand(CounterCommands.decrement);

  return (
    <Card>
      <Box display="flex" alignItems="center" padding={2}>
        <Typography>Count: {value}</Typography>
        <Box marginLeft={1}>
          <IconButton disabled={!decrement.canExecute} onClick={() => decrement.execute({})}>
            <DecrementIcon />
          </IconButton>
        </Box>
        <Box marginLeft={1}>
          <IconButton disabled={!increment.canExecute} onClick={() => increment.execute({})}>
            <IncrementIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
