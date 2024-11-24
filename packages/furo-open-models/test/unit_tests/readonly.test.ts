import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

describe('Readonly', () => {
  it('should set readonly deep on every child of a node', async () => {
    const t = new Defaults();
    expect(t.__readonly).to.be.false;
    expect(t.stringArray.__readonly).to.be.true;
    expect(t.decRange.__readonly).to.be.true;
    expect(t.stringArray.at(0)!.__readonly).to.be.true;
    t.stringArray.__readonly = false;
    expect(t.stringArray.__readonly).to.be.false;
    expect(t.decRange.__readonly).to.be.true;
    // the parent was initially readonly, so it will keep the readonly state
    expect(t.stringArray.value[0].__readonly).to.be.true;
  });

  it('should restore the readonly settings of child nodes', async () => {
    const t = new Defaults();
    expect(t.__readonly).to.be.false;
    expect(t.stringArray.__readonly).to.be.true;
    expect(t.stringArray.value[0].__readonly).to.be.true;
    t.__readonly = true;
    expect(t.__readonly).to.be.true;
    expect(t.stringArray.__readonly).to.be.true;
    expect(t.stringArray.value[0].__readonly).to.be.true;

    t.__readonly = false;
    expect(t.__readonly).to.be.false;
    expect(t.stringArray.__readonly).to.be.true;
    expect(t.stringArray.value[0].__readonly).to.be.true;
  });
});
