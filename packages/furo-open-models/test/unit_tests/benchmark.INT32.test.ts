import { expect } from '@open-wc/testing';

import { INT32 } from '@furo/open-models/dist/primitives/INT32';

describe('Benchmark INT32', () => {
  it('should create COLD 10.000 a primitive INT32 in less then 50ms', async () => {
    const ftdarr: INT32[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new INT32());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(50);
    // console.log('10.000 COLD primitive INT32', t1 - t0, 'ms');
  });
  it('should create 10.000 a primitive INT32 in less then 10ms', async () => {
    const ftdarr: INT32[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new INT32());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(10);
    // console.log('10.000 primitive INT32', t1 - t0, 'ms');
  });
});
