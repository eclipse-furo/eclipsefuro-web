import { expect } from '@open-wc/testing';

import { Numeric } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric';

describe('Benchmark', () => {
  it('should create 10.000 a simple object with an array and primitive in less then 200ms', async () => {
    const ftdarr: Numeric[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new Numeric());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(200);
    // console.log('10.000 COLD Numeric', t1 - t0, 'ms');
  });
  it('should create 10.000 a simple object with an array and primitive in less then 20ms', async () => {
    const ftdarr: Numeric[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 10000; i += 1) {
      ftdarr.push(new Numeric());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(200);
    // console.log('10.000 Numeric', t1 - t0, 'ms');
  });
});
