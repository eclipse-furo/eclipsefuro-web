import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

const initData: IIdentifier[] = [
  {
    id: 'hwe',
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
      value: '',
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
    // fatString not set
    trueFalse: false,
  },
];

describe('empty objects for json', () => {
  it('should not return empty objects', async () => {
    const id = new Identifier(initData[2]);
    expect(id.trueFalse.__isEmpty, '__isEmpty').to.equal(true);
    expect(id.__toJson().fat_string).to.equal(undefined);
  });

  it('should return full object', async () => {
    const id = new Identifier(initData[1]);
    expect(id.__toJson().fat_string).to.eql({
      value: '123',
      labels: { aaa: true, xxxx: false },
      attributes: { key: 'BBBB', value: 'stand.' },
    });
  });
  it('should not return empty string in full object', async () => {
    const id = new Identifier(initData[0]);
    expect(id.__toJson().fat_string).to.eql({
      labels: { aaa: true, xxxx: false },
      attributes: { key: 'BBBB', value: 'stand.' },
    });
  });
  it('should  return empty string in full object', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const id = new Identifier(initData[0]);

    expect(id.__toJson().fat_string).to.eql({
      value: '',
      labels: { aaa: true, xxxx: false },
      attributes: { key: 'BBBB', value: 'stand.' },
    });
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('should create the object with json data', async () => {
    const json = {
      id: 'hwe',
      attributes: { key: 'BBBB', value: 'stand' },
      string_array: ['------', '++++++'],
      booking_center: 'BBC_AT',
      dec_range: {
        start: { value: '123' },
        end: { value: '12335' },
      },
      any: {
        '@type': 'x/furo.type.Identifier',
        id: 'he',
        booking_center: 'BBC_SG',
        attributes: { key: 'BBBB', value: 'stand' },
        string_array: ['A', 'B', 'C'],
      },
      repeated_decimal: [{ value: '1234' }, { value: '12324' }],
      fat_string: {
        value: '',
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
      true_false: false,
    };

    const id2 = new Identifier();
    const l = id2.__mapProtoNameJsonToJson(json);

    expect(l).to.eql({
      id: 'hwe',
      attributes: { key: 'BBBB', value: 'stand' },
      stringArray: ['------', '++++++'],
      bookingCenter: 'BBC_AT',
      decRange: {
        start: { value: '123' },
        end: { value: '12335' },
      },
      any: {
        '@type': 'x/furo.type.Identifier',
        id: 'he',
        bookingCenter: 'BBC_SG',
        attributes: { key: 'BBBB', value: 'stand' },
        stringArray: ['A', 'B', 'C'],
      },
      repeatedDecimal: [{ value: '1234' }, { value: '12324' }],
      fatString: {
        value: '',
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
      trueFalse: false,
    });

    id2.__fromProtoNameJson(json);
    expect(id2.__toJson()).to.eql({
      id: 'hwe',
      attributes: { key: 'BBBB', value: 'stand' },
      string_array: ['------', '++++++'],
      booking_center: 'BBC_AT',
      dec_range: {
        start: { value: '123' },
        end: { value: '12335' },
      },
      any: {
        '@type': 'x/furo.type.Identifier',
        id: 'he',
        booking_center: 'BBC_SG',
        attributes: { key: 'BBBB', value: 'stand' },
        string_array: ['A', 'B', 'C'],
      },
      repeated_decimal: [{ value: '1234' }, { value: '12324' }],
      fat_string: {
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
    });

    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });
});
