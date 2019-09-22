import React from 'react';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useApp, CommandExecutor, Command } from '@neon-js/react';

export const CommandsDropdown: React.FC = () => {
  const app = useApp();
  const [isOpen, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const renderMenuItem = (command: Command<any>) => {
    return (
      <CommandExecutor key={command.id} command={command}>
        {(canExecute, execute) => (
          <MenuItem key={command.id} disabled={!canExecute} onClick={execute}>
            {command.name}
          </MenuItem>
        )}
      </CommandExecutor>
    );
  };

  return (
    <div>
      <ButtonGroup variant="outlined" color="inherit" ref={anchorRef} aria-label="split button">
        <Button onClick={() => {}}>Execute Command</Button>
        <Button
          color="inherit"
          size="small"
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={() => setOpen(!isOpen)}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={isOpen} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList>{app.providedCommands.map(renderMenuItem)}</MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
