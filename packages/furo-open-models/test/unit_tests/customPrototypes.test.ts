import { expect } from '@open-wc/testing';
import { Decimal } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Decimal';
import { DecimalRange } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/DecimalRange';
import '@furo/open-models/dist/protoc-gen-open-models/CustomPrototypes';

describe('Scenario: Custom type casting', () => {
  it('Complex type can define a custom toString', async () => {
    const deci: Decimal = new Decimal({ value: '12.5' });
    expect(deci.toString()).to.equal('12.5');
  });

  it('Complex type can define a custom valueOf', async () => {
    const deci: Decimal = new Decimal({ value: '12.5' });
    expect(deci.valueOf()).to.equal(12.5);
  });

  it('Complex type containing complex types can define a custom toString', async () => {
    const decrange: DecimalRange = new DecimalRange({
      start: { value: '12.5' },
      end: { value: '13.5' },
    });
    expect(decrange.toString()).to.equal('12.5 - 13.5');
  });
});
