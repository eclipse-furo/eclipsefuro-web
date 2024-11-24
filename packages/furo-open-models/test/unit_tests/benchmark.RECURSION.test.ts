import { expect } from '@open-wc/testing';

import { Tree } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Tree';

describe('Benchmark', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildTree(r: any, depth: number) {
    // eslint-disable-next-line no-param-reassign
    r.displayName = depth.toString();
    if (depth < 50) {
      // eslint-disable-next-line no-param-reassign
      r.recursion = {};
      // eslint-disable-next-line no-param-reassign
      r.recursion = buildTree(r.recursion, depth + 1);
    }
    return r;
  }

  const tree = buildTree(
    {
      displayName: 'A',
    },
    0,
  );

  it('should create recursive object with depth 50  in less then 10ms', async () => {
    const t0 = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = new Tree(tree);
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('Depth 50 COLD Tree', t1 - t0, 'ms');
  });

  it('should create recursive object with depth 50  in less then 10ms', async () => {
    const t0 = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = new Tree(tree);
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('Depth 50  Tree', t1 - t0, 'ms');
  });

  it('should create recursive object with depth 100  in less then 10ms', async () => {
    const t0 = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = new Tree(tree);
    const t1 = performance.now();
    expect(t1 - t0).to.lte(100);
    // console.log('100  Tree', t1 - t0, 'ms');
  });
});
