import { expect } from '@open-wc/testing';

import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';

describe('Benchmark', () => {
  it('should create COLD 1.000 complex deep object  in less then 200ms', async () => {
    const ftdarr: Identifier[] = [];
    const t0 = performance.now();
    for (let i = 0; i < 1000; i += 1) {
      ftdarr.push(new Identifier());
    }
    const t1 = performance.now();
    expect(t1 - t0).to.lte(200);
    // console.log('1.000 COLD Identifier', t1 - t0, 'ms');
  });

  it('should create 1.000 complex deep object  in less then 200ms', async () => {
    const ftdarr: Identifier[] = [];
    const t0 = performance.now();
    for (let i = 0; i < 1000; i += 1) {
      ftdarr.push(new Identifier());
    }
    const t1 = performance.now();
    expect(t1 - t0).to.lte(200);
    // console.log('1.000 Identifier', t1 - t0, 'ms');
  });
});
