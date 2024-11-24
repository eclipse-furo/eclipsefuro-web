import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';

import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
OPEN_MODELS_OPTIONS.EmitDefaultValues = false;

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
  {},
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

describe('primitives ENUM type', () => {
  it('should return correct enum', async () => {
    const id = new Identifier(initData[2]);
    expect(id.bookingCenter.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.__toJson().booking_center).to.equal('BBC_AT');
  });

  it('should print a correct toString', async () => {
    const id = new Identifier(initData[2]);
    expect(id.bookingCenter.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.bookingCenter.toString()).to.equal('BBC_AT');
  });

  it('should print a correct toString', async () => {
    const id = new Identifier(initData[1]);
    expect(id.bookingCenter.__isEmpty, '__isEmpty').to.equal(true);
    expect(id.bookingCenter.value).to.equal('BOOKING_CENTER_UNSPECIFIED');
    expect(id.bookingCenter.toString()).to.equal('BOOKING_CENTER_UNSPECIFIED');
  });

  it('should use the initial value when a non enum value was set', async () => {
    const id = new Identifier(initData[2]);
    expect(id.bookingCenter.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.bookingCenter.toString()).to.equal('BBC_AT');

    id.bookingCenter.__fromLiteral('SomeThing');
    expect(id.bookingCenter.value).to.equal('BBC_AT');
    expect(id.bookingCenter.toString()).to.equal('BBC_AT');

    id.bookingCenter.__fromLiteral('BBC_CH');
    expect(id.bookingCenter.toString()).to.equal('BBC_CH');
  });
});
