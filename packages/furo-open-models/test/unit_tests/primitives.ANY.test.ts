import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
OPEN_MODELS_OPTIONS.EmitDefaultValues = false;

const initData: IIdentifier[] = [
  {
    any: {
      '@type': 'x/furo.type.Identifier',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
      stringArray: ['first', 'second'],
    },
  },
  {},
  {
    id: '',
    any: {
      '@type': 'x/furo.type.Nonexistent',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
    },
  },
  {
    id: '',
    any: {
      '@type': 'furo.type.Identifier',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
    },
  },
  {
    id: '',
    any: {
      '@type': '',
      id: 'he',
      bookingCenter: BookingCenter.BBC_SG,
      attributes: { key: 'BBBB', value: 'stand' },
    },
  },
];

describe('primitives ANY type', () => {
  it('should console an error for empty @type field', async () => {
    const err = window.console.error;
    window.console.error = () => {};

    const id = new Identifier(initData[4]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(true);
    expect(id.__stringify()).to.eql('{"string_array":["A","B","C"]}');
    window.console.error = err;
  });

  it('should accept typename without x/', async () => {
    const id = new Identifier(initData[3]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.__toJson().any.booking_center).to.equal('BBC_SG');
  });

  it('should assign a IAny to a ANY field', async () => {
    const id = new Identifier(initData[0]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.__toJson().any.booking_center).to.equal('BBC_SG');

    id.any = {
      '@type': 'furo.type.Decimal',
      value: '1234',
    };
    expect(id.any.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.any.typeName).to.equal('furo.type.Decimal');
    expect(id.any.__toLiteral()).to.eql({
      '@type': 'furo.type.Decimal',
      value: '1234',
    });

    expect(id.any.__stringify()).to.eql(
      '{"value":"1234","@type":"furo.type.Decimal"}',
    );
  });

  it('should create correct ANY', async () => {
    const id = new Identifier(initData[0]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.__toJson().any.booking_center).to.equal('BBC_SG');
  });

  it('should return the created typename', async () => {
    const id = new Identifier(initData[0]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(false);
    expect(id.any.typeName).to.equal('furo.type.Identifier');
  });

  it('should have correct typename', async () => {
    const id = new Identifier(initData[0]);
    expect(id.any.__meta.typeName).to.equal('google.protobuf.Any');
    expect(id.__toJson().any.booking_center).to.equal('BBC_SG');
  });

  it('should log an error on unknown Any types', async () => {
    const err = window.console.error;
    window.console.error = () => {};

    const id = new Identifier(initData[2]);
    expect(id.any.value).to.equal(undefined);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(true);
    expect(id.__stringify()).to.eql('{"string_array":["A","B","C"]}');
    window.console.error = err;
  });

  it('should be empty if not set', async () => {
    const id = new Identifier(initData[1]);
    expect(id.any.__isEmpty, '__isEmpty').to.equal(true);

    expect(id.__stringify()).to.eql('{"string_array":["A","B","C"]}');
  });
  it('should use ANY types type as root for labels', async () => {
    const id = new Identifier(initData[0]);

    expect(id.bookingCenter.__label).to.equal(
      'FURO_TYPE_IDENTIFIER_BOOKING_CENTER',
    );
    expect((id.any.value as Identifier).bookingCenter.__label).to.equal(
      'FURO_TYPE_IDENTIFIER_BOOKING_CENTER',
    );
  });

  it('should resolve the full path', async () => {
    const id = new Identifier(initData[0]);

    expect((id.any.value as Identifier).bookingCenter.__fieldPath).to.equal(
      'any.value.booking_center',
    );
    expect((id.any.value as Identifier).bookingCenter).to.equal(
      id.__getFieldNodeByPath('any.value.booking_center'),
    );
  });

  it('should resolve the full path of array nodes', async () => {
    const id = new Identifier(initData[0]);
    const p = (id.any.value as Identifier).stringArray.value[1].__fieldPath;
    expect(p).to.equal('any.value.string_array[1]');
  });
});
