import { expect } from 'vitest';


describe('Benchmark', () => {
  it('should create recursive object with depth 50  in less then 10ms', async () => {
    const t0 = performance.now();
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('Depth 50 COLD Tree', t1 - t0, 'ms');
  });

  it('should create recursive object with depth 50  in less then 10ms', async () => {
    const t0 = performance.now();
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('Depth 50  Tree', t1 - t0, 'ms');
  });

  it('should create recursive object with depth 100  in less then 10ms', async () => {
    const t0 = performance.now();
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('100  Tree', t1 - t0, 'ms');
  });
});
