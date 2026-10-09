import { assert } from '@esm-bundle/chai';
import { FuroLocation, FuroNavigationLock } from '../dist/index.js';

/** Stands in for a popstate listener added after the FuroLocation (e.g. a FuroWaypoint). */
let routerCalls = 0;
const router = () => {
  routerCalls += 1;
};

describe('FuroNavigationLock and the browser back button', () => {
  const location = new FuroLocation('^');
  const lock = new FuroNavigationLock('Discard?');
  const originalConfirm = window.confirm;
  const originalForward = window.history.forward;
  let confirmAnswer;
  let confirmCalls;
  let forwardCalls;

  before(() => {
    window.addEventListener('popstate', router, true);
  });

  after(() => {
    window.removeEventListener('popstate', router, true);
    location.disconnect();
  });

  beforeEach(() => {
    routerCalls = 0;
    confirmCalls = 0;
    forwardCalls = 0;
    window.confirm = () => {
      confirmCalls += 1;
      return confirmAnswer;
    };
    window.history.forward = () => {
      forwardCalls += 1;
    };
  });

  afterEach(() => {
    lock.unlock();
    window.confirm = originalConfirm;
    window.history.forward = originalForward;
  });

  it('lets a traversal through without a lock', () => {
    window.dispatchEvent(new PopStateEvent('popstate'));

    assert.equal(routerCalls, 1);
    assert.equal(forwardCalls, 0);
  });

  it('keeps the location when the user cancels, without telling later listeners', () => {
    confirmAnswer = false;
    lock.lock();

    window.dispatchEvent(new PopStateEvent('popstate'));
    assert.equal(confirmCalls, 1);
    assert.equal(routerCalls, 0);
    assert.equal(forwardCalls, 1);

    // the popstate of history.forward() is swallowed without asking again
    window.dispatchEvent(new PopStateEvent('popstate'));
    assert.equal(confirmCalls, 1);
    assert.equal(routerCalls, 0);
  });

  it('lets the traversal through and unlocks when the user confirms', () => {
    confirmAnswer = true;
    lock.lock();

    window.dispatchEvent(new PopStateEvent('popstate'));
    assert.equal(routerCalls, 1);
    assert.equal(forwardCalls, 0);

    window.dispatchEvent(new PopStateEvent('popstate'));
    assert.equal(confirmCalls, 1);
  });

  it('lets a traversal on the same path through in path-only mode', () => {
    confirmAnswer = false;
    lock.lockPath();

    window.dispatchEvent(new PopStateEvent('popstate'));
    assert.equal(confirmCalls, 0);
    assert.equal(routerCalls, 1);
  });
});
