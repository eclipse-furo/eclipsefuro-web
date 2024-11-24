import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import '@furo/open-models/dist/protoc-gen-open-models/CustomPrototypes';
import '@furo/open-models/dist/protoc-gen-open-models/BusinessValidators';

import { expect } from '@open-wc/testing';

const initData: IIdentifier = {
  id: 'events',
  attributes: { key: 'BBBB', value: 'stand' },
  stringArray: ['------', '++++++'],
  bookingCenter: BookingCenter.BBC_AT,
  decRange: {
    start: { value: '456' },
    end: { value: '123' },
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
};

describe('Validators', () => {
  it('should deep validate with __validate() on root node', async () => {
    const id = new Identifier(initData);
    id.__validate();

    expect(id.decRange.__isValid).to.be.false;
    expect(id.__isValid).to.be.false;
  });

  it('should bubble up validations', async () => {
    const id = new Identifier(initData);
    // start should be smaller then end
    id.decRange = {
      start: { value: '456' },
      end: { value: '123' },
    };

    expect(id.decRange.__isValid).to.be.false;
    expect(id.__isValid).to.be.false;
  });

  it('should be valid when a invalid child gets valid again', async () => {
    const id = new Identifier(initData);
    // start should be smaller then end
    id.decRange = {
      start: { value: '456' },
      end: { value: '123' },
    };
    expect(id.decRange.__isValid).to.be.false;
    expect(id.__isValid).to.be.false;

    id.decRange = {
      start: { value: '123' },
      end: { value: '345' },
    };
    expect(id.decRange.__isValid).to.be.true;
    expect(id.__isValid).to.be.true;
  });

  it('should validate ANY type', async () => {
    const id = new Identifier(initData);
    // start should be smaller then end
    (id.any.value as Identifier).decRange.start.value = '444';
    (id.any.value as Identifier).decRange.end.value = '123';

    expect(id.any.value!.__isValid).to.be.false;
    expect(id.any.__isValid).to.be.false;
    expect(id.__isValid).to.be.false;

    (id.any.value as Identifier).decRange = {
      start: { value: '123' },
      end: { value: '345' },
    };

    expect(id.any.value!.__isValid).to.be.true;
    expect(id.__isValid).to.be.true;
  });

  it('should call the validator on data change from "outside"', async () => {
    const id = new Identifier(initData);
    expect(id.id.toString()).to.equal('events');
    id.id = 'must error';
  });
});
