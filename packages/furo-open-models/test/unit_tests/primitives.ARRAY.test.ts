import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import { ARRAY } from '@furo/open-models/dist/';
import { Decimal } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Decimal';
import type { IDecimal } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Decimal';

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
      stringArray: ['------', '++++++'],
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
      stringArray: ['++++++'],
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
  },
];

describe('primitives ARRAY type', () => {
  it('should accept literal on push', async () => {
    const id = new Identifier();
    id.stringArray.push('stringliteral');
    expect(id.stringArray.__toLiteral()).to.eql([
      'A',
      'B',
      'C',
      'stringliteral',
    ]); // a,b,c is from the default
  });

  it('should error on direct init', done => {
    const e = console.error;
    console.error = () => {
      console.error = e;

      done();
    };
    const arr = new ARRAY<Decimal, IDecimal>([{ value: '3' }]);
    expect(arr.length).to.eql(0); // a,b,c is from the default
  });

  it('should be possible to assign a literal data to an Array field', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.__toLiteral().length).to.eql(4);
    id.repeatedDecimal = [{ value: '9.95' }];
    expect(id.repeatedDecimal.__toLiteral().length).to.eql(1);
    expect(id.repeatedDecimal.atT(0)?.__meta.index).to.eql(0);
    id.repeatedDecimal = [{ value: '2.95' }, { value: '3.95' }];
    expect(id.repeatedDecimal.__toLiteral().length).to.eql(2);
  });

  it('must return baseName without array index', async () => {
    const id = new Identifier(initData[1]);

    expect(id.repeatedDecimal.value[1].value.__label).to.eql(
      'FURO_TYPE_IDENTIFIER_REPEATED_DECIMAL_VALUE',
    );
  });
  it('must deeply generate the ARRAYS<something> from code', async () => {
    const idArr = ARRAY.Builder<Identifier, IIdentifier>(Identifier, initData);
    expect(idArr.length).to.eql(2);
    expect(idArr.value[1].attributes.__toLiteral()).to.eql({
      key: 'second',
      value: 'second',
    });
  });
  it('must return the same litereal that was given', async () => {
    const idArr = ARRAY.Builder<Identifier, IIdentifier>(Identifier, initData);
    expect(idArr.__toLiteral()).to.eql(initData);
  });

  it('should have the regular Array property "length"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.length).to.eql(4);
  });

  it('should have the regular Array method "at"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.at(2)!.__toLiteral()).to.eql({ value: '2.2' });
  });

  it('should have the regular Array method "atT"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.atT(2)?.__meta.index).to.eql(2);
  });

  it('should have the regular Array method "entriesT"', async () => {
    const id = new Identifier(initData[1]);
    const iterator = id.repeatedDecimal.entriesT();
    expect(iterator.next().value[1].__meta.index).to.eql(0);
    expect(iterator.next().value[1].__meta.index).to.eql(1);
  });

  it('should have the regular Array method "entries"', async () => {
    const id = new Identifier(initData[1]);
    const iterator = id.repeatedDecimal.entries();
    expect(iterator.next().value[1]).to.eql({ value: '1234' });
    expect(iterator.next().value[1]).to.eql({ value: '12324' });
  });

  it('should have the regular Array method "toString"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.toString()).equal('[object ARRAY<Decimal>]');
  });

  it('should have the regular Array method "__stringify"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.__stringify()).to.eql(
      '[{"value":"1234"},{"value":"12324"},{"value":"2.2"},{"value":"3.3"}]',
    );
    expect(id.__stringify()).to.eql(
      '{"booking_center":"BBC_AT","attributes":{"key":"second","value":"second"},"id":"second","string_array":["second","++++++"],"repeated_decimal":[{"value":"1234"},{"value":"12324"},{"value":"2.2"},{"value":"3.3"}],"dec_range":{"start":{"value":"222"},"end":{"value":"333"}},"any":{"booking_center":"BBC_SG","attributes":{"key":"BBBB","value":"stand"},"id":"he","string_array":["++++++"],"@type":"x/furo.type.Identifier"},"fat_string":{"value":"123","labels":{"aaa":true,"xxxx":false},"attributes":{"key":"BBBB","value":"stand."}}}',
    );
  });

  it('should have the regular Array method "delete"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.length).to.eql(4);
    expect(id.repeatedDecimal.delete(0)).to.eql({ value: '1234' });
    expect(id.repeatedDecimal.length).to.eql(3);
    expect(id.repeatedDecimal.value[0].__meta.index).to.eql(0);
  });

  it('should have the regular Array method "deleteT"', async () => {
    const id = new Identifier(initData[1]);
    expect(id.repeatedDecimal.length).to.eql(4);
    const del = id.repeatedDecimal.deleteT(0);
    expect(del.__meta.typeName).to.eql('furo.type.Decimal');
    expect(id.repeatedDecimal.length).to.eql(3);
    expect(id.repeatedDecimal.value[0].__meta.index).to.eql(0);
  });

  it('should have the regular Array method "map"', async () => {});

  it('should have the regular Array method "forEach"', async () => {});
  it('should have the regular Array method "indexOf"', async () => {});
  it('should have the regular Array method "keys"', async () => {});
  it('should have the regular Array method "lastIndexOf"', async () => {});
  it('should have the regular Array method "pop"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "push"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "reverse"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "shift"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "slice"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "splice"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "unshift"', async () => {
    // todo: also check indexes
  });
  it('should have the regular Array method "values"', async () => {});
});
