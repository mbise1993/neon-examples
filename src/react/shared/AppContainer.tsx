import React from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { AppProvider, useCommand } from 'react-neon';
import { NeonApp, NeonCommands } from 'neon';

import { CommandsDropdown } from './CommandsDropdown';

export interface AppContainerProps {
  app: NeonApp;
}

export const AppContainer: React.FC<AppContainerProps> = ({ app, children }) => {
  const undo = useCommand(NeonCommands.undo);
  const redo = useCommand(NeonCommands.redo);

  return (
    <AppProvider app={app}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Box flexGrow={1} display="flex" alignItems="center">
              <Typography variant="h6">{app.name}</Typography>
              <Box marginLeft={2}>
                <CommandsDropdown app={app} />
              </Box>
            </Box>
            <Box>
              <IconButton
                title="Undo"
                color="inherit"
                disabled={!undo.canExecute()}
                onClick={() => undo.execute({})}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                title="Redo"
                color="inherit"
                disabled={!redo.canExecute()}
                onClick={() => redo.execute({})}
              >
                <RedoIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box paddingY={2}>{children}</Box>
      </Box>
    </AppProvider>
  );
};
