import { History } from './history';
import { State } from './testUtil';

describe(History.name, () => {
  it('can go back and forward 1 frame', () => {
    let state: State = { count: 1 };
    const history = new History<State>(10, () => state);

    history.push('frame1');
    state = { count: 2 };
    history.push('frame2');
    state = { count: 3 };
    history.push('frame3');

    state = history.goBack(1);
    expect(state.count).toBe(3);

    state = history.goForward(1);
    expect(state.count).toBe(3);
  });

  it('can go back and forward multiple frames', () => {
    let state: State = { count: 1 };
    const history = new History<State>(10, () => state);

    history.push('frame1');
    state = { count: 2 };
    history.push('frame2');
    state = { count: 3 };
    history.push('frame3');
    state = { count: 4 };
    history.push('frame4');

    state = history.goBack(3);
    expect(state.count).toBe(2);

    state = history.goForward(1);
    expect(state.count).toBe(4);
  });
});
