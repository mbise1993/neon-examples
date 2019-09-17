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
import { NeonApp, Command } from 'neon';
import { DomainContext } from 'neon/src';

interface CommandInfo {
  command: Command<any, any>;
  context: DomainContext<any>;
}

export interface CommandsDropdownProps {
  app: NeonApp;
}

export const CommandsDropdown: React.FC<CommandsDropdownProps> = ({ app }) => {
  const [isOpen, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const options = app.getDomainContexts().reduce(
    (acc, context) => {
      context.getCommands().forEach(command => {
        acc.push({
          command,
          context,
        });
      });

      return acc;
    },
    [] as CommandInfo[],
  );

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
                  {options.map(option => (
                    <MenuItem
                      key={option.command.getId()}
                      onClick={() => option.command.execute(option.context, undefined)}
                    >
                      {option.command.getDescription()}
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