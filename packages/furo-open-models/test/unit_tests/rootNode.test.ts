import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';

describe('root node', () => {
  it('must have the correct root node', async () => {
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
      },
      repeatedDecimal: [{ value: '1234' }, { value: '12324' }],
      fatString: {
        value: '123',
        labels: { aaa: true, xxxx: false },
        attributes: { key: 'BBBB', value: 'stand.' },
      },
    };

    const id = new Identifier(initData);
    expect(id.id.__rootNode).to.eql(id);
    expect(id.decRange.start.value.__rootNode).to.eql(id);
  });
});
