import { expect } from '@open-wc/testing';
import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';
import '@furo/open-models/dist/protoc-gen-open-models/CustomPrototypes.js';
import '@furo/open-models/dist/protoc-gen-open-models/BusinessValidators.js';

describe('Custom Field  Constraints', () => {
  it('should trigger a error on child of array nodes', async () => {
    const c = new Defaults();
    expect(c.repeatedDecimal.__isEmpty).to.be.true;
    expect(c.repeatedDecimal.__isValid).to.be.true;
    c.id = '---';
    c.repeatedDecimal.add();
    c.__validate();
    expect(c.repeatedDecimal.__isValid).to.be.false;
    c.repeatedDecimal.at(0)!.value = '3.1';
    c.__validate();
    expect(c.repeatedDecimal.at(0)!.toString()).to.eql('3.1');

    expect(c.repeatedDecimal.at(0)!.__isValid).to.be.true;
    expect(c.repeatedDecimal.__isValid).to.be.true;

    c.repeatedDecimal.at(0)!.value = '3';
    expect(c.__isValid).to.be.false;

    expect(c.repeatedDecimal.at(0)!.__isValid).to.be.false;
    expect(c.repeatedDecimal.__isValid).to.be.false;
  });
});
