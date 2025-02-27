import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

describe('Field Constraints', () => {
  it('should trigger a error on empty types when required', async () => {
    const c = new Defaults();
    expect(c.repeatedDecimal.__isEmpty).to.be.true;
    expect(c.repeatedDecimal.__isValid).to.be.true;
    c.__validate();
    expect(c.repeatedDecimal.__isValid).to.be.false;
  });

  it('should mark required empty strings as error', async () => {
    const c = new Defaults();
    expect(c.id.__isValid).to.be.true;
    c.id = '';
    expect(c.__isValid).to.be.false;
    expect(c.id.__meta.valueState).to.equal('Negative');
    expect(c.id.__meta.stateMessage).to.equal(
      'constraint.violation.min_length 3 ',
    );

    c.id = '---';
    expect(c.id.__isValid).to.be.true;
    expect(c.id.__meta.valueState).to.equal('None');
  });

  it('should mark min length strings as error', async () => {
    const c = new Defaults();
    expect(c.id.__isValid).to.be.true;

    c.id = '-';
    expect(c.__isValid).to.be.false;
    expect(c.id.__meta.valueState).to.equal('Negative');
    expect(c.id.__meta.stateMessage).to.equal(
      'constraint.violation.min_length 3 -',
    );

    c.id = '---';
    expect(c.id.__isValid).to.be.true;
    expect(c.id.__meta.valueState).to.equal('None');
  });

  it('should mark max length strings as error', async () => {
    const c = new Defaults();
    expect(c.id.__isValid).to.be.true;

    c.id = '1234567890-';
    expect(c.__isValid).to.be.false;
    expect(c.id.__meta.valueState).to.equal('Negative');
    expect(c.id.__meta.stateMessage).to.equal(
      'constraint.violation.max_length 10 1234567890-',
    );

    c.id = '---';
    expect(c.id.__isValid).to.be.true;
    expect(c.id.__meta.valueState).to.equal('None');
  });

  it('should check for pattern /^-*$/ ', async () => {
    const c = new Defaults();

    expect(c.id.__isValid).to.be.true;

    c.id = '---';
    expect(c.id.__isValid).to.be.true;
    expect(c.id.__meta.valueState).to.equal('None');

    c.id = '---3-';
    expect(c.__isValid).to.be.false;
    expect(c.id.__meta.valueState).to.equal('Negative');
    expect(c.id.__meta.stateMessage).to.equal(
      'constraint.violation.pattern ^-*$ ---3-',
    );
  });
});
