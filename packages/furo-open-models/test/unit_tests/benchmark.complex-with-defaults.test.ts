import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

describe('Benchmark', () => {
  it('should create 1000 COLD very complex deep object with default values and constraints set in less then 200ms', async () => {
    const ftdarr: Defaults[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 1000; i += 1) {
      ftdarr.push(new Defaults());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(200);
    // console.log('1.000 COLD Defaults', t1 - t0, 'ms');
  });

  it('should create 1000 very complex deep object with default values and constraints set in less then 150ms', async () => {
    const ftdarr: Defaults[] = [];
    const t0 = performance.now();

    for (let i = 0; i < 1000; i += 1) {
      ftdarr.push(new Defaults());
    }

    const t1 = performance.now();
    expect(t1 - t0).to.lte(150);
    // console.log('1.000 Defaults', t1 - t0, 'ms');
  });
});
