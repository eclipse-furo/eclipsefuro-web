import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';
import { STRING } from '@furo/open-models';

describe('Default Values', () => {
  it('should create default values for ENUM types', async () => {
    const defaults = new Defaults();
    expect(defaults.bookingCenter.__toLiteral()).to.eql('BBC_CH');
    defaults.__reset();
    expect(defaults.bookingCenter.__toLiteral()).to.eql('BBC_CH');
  });

  it('should create default values for MAP types', async () => {
    const defaults = new Defaults();
    expect(defaults.attributes.__toLiteral()).to.eql({ we: 'have' });
    defaults.__reset();
    expect(defaults.attributes.__toLiteral()).to.eql({ we: 'have' });
  });

  it('should create default values for ARRAY types', async () => {
    const defaults = new Defaults();
    expect(defaults.stringArray.__toLiteral()).to.eql(['A', 'B', 'C']);
    defaults.__reset();
    expect(defaults.stringArray.__toLiteral()).to.eql(['A', 'B', 'C']);
  });

  it('should create partial default values for custom types', async () => {
    const defaults = new Defaults();
    expect(defaults.decRange.__toLiteral()).to.eql({ start: { value: '123' } });
    defaults.__reset();
    expect(defaults.decRange.__toLiteral()).to.eql({ start: { value: '123' } });
  });

  it('should default value for primitive.STRING', async () => {
    const defaults = new Defaults();
    expect(defaults.id.__toLiteral()).to.eql('default');
    defaults.__reset();
    expect(defaults.id.__toLiteral()).to.eql('default');
  });

  it('should create default values for ENUM types', async () => {
    const defaults = new Defaults();
    defaults.fatString.value = 'str';
    defaults.fatString.attributes.set('this', new STRING('works'));
    expect(defaults.fatString.__toLiteral()).to.eql({
      attributes: {
        this: 'works',
      },
      value: 'str',
    });

    defaults.__reset();
    expect(defaults.fatString.__toLiteral()).to.eql({});
  });
});
