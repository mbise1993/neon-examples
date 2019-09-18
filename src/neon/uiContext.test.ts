import { NeonUiContext } from './uiContext';
import { updateCountCommand, TestDomainContext } from './testUtil';

describe(NeonUiContext.name, () => {
  it('can add and get child UiContexts', () => {
    const parent = new NeonUiContext('parent');
    const child = new NeonUiContext('child');
    const nestedChild = new NeonUiContext('nested-child');
    child.addChildContext(nestedChild);
    parent.addChildContext(child);

    let result = parent.getChildContext(child.id);
    expect(result).toBe(child);

    result = parent.getChildContext(nestedChild.id);
    expect(result).toBe(nestedChild);
  });

  it('can add DomainContexts', () => {
    const uiContext = new NeonUiContext('ui-context');
    const domainContext = new TestDomainContext();
    uiContext.attachDomainContext(domainContext);
  });

  it('can execute Keybindings', () => {
    const uiContext = new NeonUiContext('ui-context');
    const domainContext = new TestDomainContext();
    domainContext.registerCommand(updateCountCommand);
    uiContext.attachDomainContext(domainContext);
    uiContext.registerKeybinding({
      keyCode: 'Cmd+s',
      command: updateCountCommand
    });

    const success = uiContext.tryHandleKeyCode('Cmd+s');
    expect(success).toBe(true);
  });
});
