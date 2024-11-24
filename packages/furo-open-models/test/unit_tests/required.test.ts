import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

describe('Default Values', () => {
  it('should return every required field', async () => {
    const defaults = new Defaults();
    expect(defaults.__toLiteral()).to.eql({
      stringArray: ['A', 'B', 'C'],
      attributes: { we: 'have' },
      repeatedDecimal: [],
      decRange: { start: { value: '123' } },
      bookingCenter: 'BBC_CH',
      id: 'default',
    });
    defaults.__reset();
    expect(defaults.__toLiteral()).to.eql({
      stringArray: ['A', 'B', 'C'],
      attributes: { we: 'have' },
      repeatedDecimal: [],
      decRange: { start: { value: '123' } },
      id: 'default',
      bookingCenter: 'BBC_CH',
    });
  });
});
