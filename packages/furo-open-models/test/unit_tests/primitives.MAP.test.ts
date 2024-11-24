import { expect } from '@open-wc/testing';
import { MAP, STRING } from '@furo/open-models/dist/index';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';

describe('primitives MAP type', () => {
  it('must deep generate the MAPs', async () => {
    const initData: IIdentifier = {
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
    };

    const id = new Identifier(initData);
    expect(id.__toLiteral()).to.eql(initData);
    id.attributes = { k: 'v', k2: 'v2', k3: 'v3' };
    expect(id.attributes.__toLiteral()).to.eql({ k: 'v', k2: 'v2', k3: 'v3' });
    expect(id.attributes.size).to.eql(3);
  });

  it('must be possible to create a map directly from code (with initData)', async () => {
    const initData = { key: 'value' };
    const m = MAP.Builder<string, STRING, string>(STRING, initData);
    expect(m.__stringify()).to.equal('{"key":"value"}');
  });

  it('must be possible to create a map directly from code', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);
    expect(m.__stringify()).to.equal('{"key":"value","other":"name"}');
  });

  it('must be possible to create a map with numbers as key', async () => {
    const initData = { '0': 'value', 5: 'name' };
    const m = new MAP<number, STRING, string>();
    m.initFromLiteral(STRING, initData);
    expect(m.__stringify()).to.equal('{"0":"value","5":"name"}');
  });

  it('should return the correct type on toString', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);
    expect(m.toString()).to.equal('[object MAP<..., ...>]');
  });

  it('should return the correct literal type', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);
    expect(m.__toLiteral()).to.eql({ key: 'value', other: 'name' });
  });

  it('should have the regular map methods "set" and "get"', async () => {
    const m = new MAP<string, STRING, string>();
    m.set('key', new STRING('value'));

    expect(m.get('key')).not.equal(undefined);
    expect(m.get('key')!.toString()).to.eq('value');
    expect(m.get('unknown')).equal(undefined);
    expect(m.size).equal(1);
  });

  it('should have the regular map method "size"', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);

    expect(m.size).equal(2);
  });

  it('should have the regular map methods "keys"', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);

    const iterator = m.keys();
    expect(iterator.next().value).equal('key');
    expect(iterator.next().value).equal('other');
  });

  it('should have the regular map method "forEach"', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);
    m.forEach((v, k) => {
      expect(m.has(k)).to.eq(true);
      expect(m.get(k)).to.eq(v);
    });
    expect(m.size).equal(2);
  });

  it('should have the regular map method "delete"', done => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);
    m.__addEventListener('this-map-changed', () => {
      done();
    });

    expect(m.has('key')).to.eq(true);
    m.delete('key');
    expect(m.has('key')).to.eq(false);
  });

  it('should have the regular map method "__clear"', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);

    expect(m.has('key')).to.eq(true);
    expect(m.has('other')).to.eq(true);
    expect(m.size).equal(2);
    m.__clear();
    expect(m.has('key')).to.eq(false);
    expect(m.has('other')).to.eq(false);
    expect(m.size).equal(0);
  });

  it('should have the regular map methods "entries"', async () => {
    const initData = { key: 'value', other: 'name' };
    const m = new MAP<string, STRING, string>();
    m.initFromLiteral(STRING, initData);

    const iterator = m.entries();
    expect(iterator.next().value[1].toString()).equal('value');
    expect(iterator.next().value[1].toString()).equal('name');
  });
});
