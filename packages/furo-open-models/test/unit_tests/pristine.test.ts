import { expect } from '@open-wc/testing';

import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';

describe('Pristine State', () => {
  it('should create an empty object', async () => {
    const id = new Identifier();
    expect(id.__isPristine).equal(true);
  });

  it('should have not be pristine after deep changes', async () => {
    const id = new Identifier({ id: 'init' });
    expect(id.__isPristine).equal(true);
    id.decRange.start.value = '1234';
    expect(id.__isPristine).equal(false);
    expect(id.__toLiteral()).to.eql({
      id: 'init',
      decRange: { start: { value: '1234' } },
      stringArray: ['A', 'B', 'C'],
    });
    expect(id.__isPristine).equal(false);
  });

  it('should have not be pristine after changes of children of an array', async () => {
    const id = new Identifier({ id: 'init' });
    expect(id.__isPristine).equal(true);
    id.stringArray.push('stringliteral');
    expect(id.__isPristine).equal(false);
    expect(id.__toLiteral()).to.eql({
      id: 'init',
      stringArray: ['A', 'B', 'C', 'stringliteral'],
    });
    expect(id.__isPristine).equal(false);
  });

  it('should set pristine to true after a fromLiteral({})', async () => {
    const id = new Identifier({
      id: 'deep',
      attributes: { key: 'BBBB', value: 'stand' },
      stringArray: ['------', '++++++'],
      bookingCenter: BookingCenter.BBC_AT,
      decRange: {
        start: { value: '123' },
        end: { value: '12335' },
      },
      any: {
        '@type': 'x/furo.type.Identifier',
        id: 'he',
        bookingCenter: BookingCenter.BBC_SG,
        attributes: { key: 'BBBB', value: 'stand' },
      },
      repeatedDecimal: [{ value: '1234' }, { value: '12324' }],
      fatString: {
        value: '123',
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
    });
    expect(id.__isPristine).equal(true);
    // no changes, same value
    id.decRange.start.value = '123';
    expect(id.__isPristine).equal(true);

    id.decRange.start.value = '1234';
    expect(id.__isPristine).equal(false);

    id.fromLiteral({ id: 'other' });
    expect(id.__isPristine).equal(true);

    id.id = 'xxx';
    expect(id.__isPristine).equal(false);
  });

  it('should set pristine to true after a reset', async () => {
    const id = new Identifier({ id: 'init' });
    expect(id.__isPristine).equal(true);
    // no changes, same value
    id.id = 'init';
    expect(id.__isPristine).equal(true);

    id.id = 'xxx';
    expect(id.__isPristine).equal(false);

    id.__reset();
    expect(id.__isPristine).equal(true);
  });

  it('should have a pristine object from start', async () => {
    const id = new Identifier({ id: 'init' });
    expect(id.__isPristine).equal(true);
  });

  it('should have a pristine object from start even with deep objects', async () => {
    const id = new Identifier({
      id: 'deep',
      attributes: { key: 'BBBB', value: 'stand' },
      stringArray: ['------', '++++++'],
      bookingCenter: BookingCenter.BBC_AT,
      decRange: {
        start: { value: '123' },
        end: { value: '12335' },
      },
      any: {
        '@type': 'x/furo.type.Identifier',
        id: 'he',
        bookingCenter: BookingCenter.BBC_SG,
        attributes: { key: 'BBBB', value: 'stand' },
      },
      repeatedDecimal: [{ value: '1234' }, { value: '12324' }],
      fatString: {
        value: '123',
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
    });
    expect(id.__isPristine).equal(true);
  });

  it('should have not be pristine after changes', async () => {
    const id = new Identifier({ id: 'init' });
    id.id = 'stringliteral';
    expect(id.id.value).to.eql('stringliteral');
    expect(id.id.toString()).to.eql('stringliteral');
    expect(id.__isPristine).equal(false);
  });
});
