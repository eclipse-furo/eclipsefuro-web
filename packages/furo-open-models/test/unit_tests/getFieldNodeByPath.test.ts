import { expect } from '@open-wc/testing';

import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';
import { Decimal } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Decimal';

describe('getFieldNodeByPath', () => {
  it('should return the fieldNode', async () => {
    const defaults = new Defaults();
    expect(defaults.bookingCenter.__toLiteral()).to.eql('BBC_CH');
    const bc = defaults.__getFieldNodeByPath('bookingCenter');
    expect(bc!.__toLiteral()).to.eql('BBC_CH');
  });

  it('should return the fieldNode for deeper paths', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('decRange.start.value');
    expect(bc!.__toLiteral()).to.eql('123');
  });

  it('should return the fieldNode for deeper paths in MAP nodes', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('attributes.we');
    expect(bc!.__toLiteral()).to.eql('have');
  });

  it('should return the fieldNode for deeper paths in MAP nodes', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('attributes.unknown');
    expect(bc).to.be.undefined;
  });

  it('should return the fieldNode for deeper paths in ARRAY nodes', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('string_array[1]');
    expect(bc!.__toLiteral()).to.eql('B');
    defaults.repeatedDecimal.push({ value: '10' });
    expect(defaults.repeatedDecimal.length).to.eql(1);
    const rd = defaults.repeatedDecimal.__getFieldNodeByPath('[0]') as Decimal;
    expect(rd.value.toString()).to.eql('10');
    expect(
      (
        defaults.__getFieldNodeByPath('repeated_decimal[0]') as Decimal
      ).value.toString(),
    ).to.eql('10');
    defaults.__getFieldNodeByPath('repeated_decimal[0]');
  });

  it('should return the fieldNode for deeper paths in ARRAY nodes', async () => {
    const defaults = new Defaults({
      stringArray: ['A', 'B', 'C'], // from repeated string string_array = 6 [(openapi.v3.property) = {default:{string:'["A","B","C"]'},read_only:true}];
      attributes: { we: 'have' },
      decRange: { start: { value: '123' } },
      id: 'default',
      repeatedDecimal: [{ value: '555' }],
    });

    const bc = defaults.__getFieldNodeByPath('repeated_decimal.0.value');
    expect(bc!.__toLiteral()).to.eql('555');
  });

  it('should return the undefined for deeper paths in ARRAY nodes', async () => {
    const defaults = new Defaults({
      stringArray: ['A', 'B', 'C'], // from repeated string string_array = 6 [(openapi.v3.property) = {default:{string:'["A","B","C"]'},read_only:true}];
      attributes: { we: 'have' },
      decRange: { start: { value: '123' } },
      id: 'default',
      repeatedDecimal: [{ value: '555' }],
    });

    const bc = defaults.__getFieldNodeByPath('repeated_decimal.1.value');
    expect(bc).to.be.undefined;
  });

  it('should return the undefined for empty path', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('');
    expect(bc).to.be.undefined;
  });

  it('should return the undefined for unknown field', async () => {
    const defaults = new Defaults();

    const bc = defaults.__getFieldNodeByPath('some');
    expect(bc).to.be.undefined;
  });
});
