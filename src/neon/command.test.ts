import { updateCountCommand, TestDomainContext } from './testUtil';

describe('Command', () => {
  it('can execute', () => {
    const context = new TestDomainContext();
    const result = updateCountCommand.execute(context, { newCount: 2 });
    expect(result.count).toBe(2);
  });
});
