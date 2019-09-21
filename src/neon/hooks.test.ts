import { Hooks } from './hooks';

interface TestHooks {
  readonly foo?: (value: string) => void;
  readonly bar?: (value: string) => void;
}

describe('Hooks', () => {
  it('invokes the given function', () => {
    const fooImpl = jest.fn();
    const barImpl = jest.fn();
    const testHooks: TestHooks = {
      foo: value => fooImpl(value),
      bar: value => barImpl(value),
    };

    const hooks = new Hooks<TestHooks>();
    hooks.register(testHooks);
    hooks.invokeAll('foo', ['foo-test']);
    hooks.invokeAll('bar', ['bar-test']);

    expect(fooImpl).toHaveBeenCalledTimes(1);
    expect(fooImpl).toHaveBeenCalledWith('foo-test');
    expect(barImpl).toHaveBeenCalledTimes(1);
    expect(barImpl).toHaveBeenCalledWith('bar-test');
  });
});
