import React from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useApp, useCommand } from 'react-neon2';
import { NeonCommands } from 'neon2';

import { CommandsDropdown } from './CommandsDropdown';

export const AppContainer: React.FC = ({ children }) => {
  const app = useApp();
  const undo = useCommand(NeonCommands.undo);
  const redo = useCommand(NeonCommands.redo);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box flexGrow={1} display="flex" alignItems="center">
            <Typography variant="h6">{app.name}</Typography>
            <Box marginLeft={2}>
              <CommandsDropdown />
            </Box>
          </Box>
          <Box>
            <IconButton
              title="Undo"
              color="inherit"
              disabled={!undo.canExecute}
              onClick={() => undo.execute()}
            >
              <UndoIcon />
            </IconButton>
            <IconButton
              title="Redo"
              color="inherit"
              disabled={!redo.canExecute}
              onClick={() => redo.execute()}
            >
              <RedoIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box paddingY={2}>{children}</Box>
    </Box>
  );
};
