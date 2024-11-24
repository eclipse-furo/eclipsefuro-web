import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';

import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

const initData: IIdentifier[] = [
  {
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
  },
  {
    id: 'second',
    attributes: { key: 'second', value: 'second' },
    stringArray: ['second', '++++++'],
    bookingCenter: BookingCenter.BBC_AT,
    decRange: {
      start: { value: '222' },
      end: { value: '333' },
    },
    any: {
      '@type': 'x/furo.type.Identifier',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
    },
    repeatedDecimal: [
      { value: '1234' },
      { value: '12324' },
      { value: '2.2' },
      { value: '3.3' },
    ],
    fatString: {
      value: '123',
      labels: { aaa: true, xxxx: false },
      attributes: { key: 'BBBB', value: 'stand.' },
    },
    trueFalse: true,
  },
  {
    id: '',
    attributes: { key: 'second', value: 'second' },
    stringArray: ['second', '++++++'],
    bookingCenter: BookingCenter.BBC_AT,
    decRange: {
      start: { value: '222' },
      end: { value: '333' },
    },
    any: {
      '@type': 'x/furo.type.Identifier',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
    },
    repeatedDecimal: [
      { value: '1234' },
      { value: '12324' },
      { value: '2.2' },
      { value: '3.3' },
    ],
    // fatString not set
    trueFalse: false,
  },
];

describe('primitives STRING type', () => {
  it('should not return an empty string', async () => {
    const id = new Identifier(initData[2]);
    expect(id.id.__isEmpty, '__isEmpty').to.equal(true);
    expect(id.__toJson().id).to.equal(undefined);
  });

  it('must return a empty string on __stringify when EmitDefaultValues option is set', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const id = new Identifier(initData[2]);
    expect(id.__toJson().id).to.equal('');
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('must have a default value of an empty string', async () => {
    const id = new Identifier(initData[0]);
    expect(id.id.value).eql('');
  });
  it('must print a correct toString', async () => {
    const id = new Identifier(initData[0]);
    id.id = 'some text';
    expect(id.id.toString()).eql('some text');
  });
});
