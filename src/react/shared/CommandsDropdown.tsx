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
import { NeonApp } from 'neon';

export interface CommandsDropdownProps {
  app: NeonApp;
}

export const CommandsDropdown: React.FC<CommandsDropdownProps> = ({ app }) => {
  const [isOpen, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

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
                <MenuList>
                  {app.commands.map(command => (
                    <MenuItem key={command.id} onClick={() => app.executeCommand(command, {})}>
                      {command.description}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
