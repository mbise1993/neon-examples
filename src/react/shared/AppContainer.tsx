import React from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { AppProvider } from 'react-neon';
import { NeonApp } from 'neon';

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
            <Typography variant="h6">{name}</Typography>
            <Box marginLeft={1}>
              <IconButton color="inherit">
                <UndoIcon />
              </IconButton>
            </Box>
            <Box marginLeft={1}>
              <IconButton color="inherit">
                <RedoIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {children}
      </Box>
    </AppProvider>
  );
};
