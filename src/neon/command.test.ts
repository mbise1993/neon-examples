import { updateCountCommand, CounterContext } from './testUtil';

describe('Command', () => {
  it('can execute', () => {
    const context = new CounterContext();
    const result = updateCountCommand.execute(context, { newCount: 2 });
    expect(result.count).toBe(2);
  });
});
