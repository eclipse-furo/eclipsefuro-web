import { expect } from '@open-wc/testing';

import { STRING } from '@furo/open-models/dist/primitives/STRING';

describe('Benchmark', () => {
  it('should create 10.000 a primitive STRING in less then 5ms', async () => {
    const ftdarr: STRING[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new STRING());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(20);
    // console.log('10.000 COLD primitive STRING', t1 - t0, 'ms');
  });

  it('should create 10.000 a primitive STRING in less then 10ms', async () => {
    const ftdarr: STRING[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new STRING());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(10);
    // console.log('10.000 primitive STRING', t1 - t0, 'ms');
  });
});
