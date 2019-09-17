import React from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { AppProvider } from 'react-neon';
import { NeonApp } from 'neon';

import { CommandsDropdown } from './CommandsDropdown';

export interface AppContainerProps {
  app: NeonApp;
  name: string;
}

export const AppContainer: React.FC<AppContainerProps> = ({ app, name, children }) => {
  return (
    <AppProvider app={app}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Box flexGrow={1} display="flex" alignItems="center">
              <Typography variant="h6">{name}</Typography>
              <Box marginLeft={2}>
                <CommandsDropdown app={app} />
              </Box>
            </Box>
            <Box>
              <IconButton title="Undo" color="inherit">
                <UndoIcon />
              </IconButton>
              <IconButton title="Redo" color="inherit">
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
