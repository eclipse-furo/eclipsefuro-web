import { expect } from '@open-wc/testing';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import { XString } from '@furo/open-models/dist/protoc-gen-open-models/furo/fat/String';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
describe('empty objects', () => {
  it('should return the initial "empty" object after changeing and reseting an object', async () => {
    const id = new Identifier();
    expect(id.id.toString()).to.eql('');
    id.id = 'stringliteral';
    expect(id.id.toString()).to.eql('stringliteral');
    id.__reset();
    expect(id.id.toString()).to.eql('');
    expect(id.toString()).to.eql('[object furo.type.Identifier]');
    expect(id.valueOf()).to.eql(NaN);
  });

  it('should have empty item accessible from start', async () => {
    const id = new Identifier({ id: 'init', stringArray: [] });
    id.id = 'stringliteral';
    expect(id.id.value).to.eql('stringliteral');
    id.id = '';
    id.decRange = {
      start: { value: '1.4' },
      end: { value: '2.4' },
    };

    id.stringArray.__clear();
    expect(id.__toLiteral()).to.eql({
      decRange: { start: { value: '1.4' }, end: { value: '2.4' } },
      stringArray: [],
    });

    id.id.__clear();

    id.decRange = { start: { value: '444.4' } };

    expect(id.__toLiteral()).to.eql({
      decRange: { start: { value: '444.4' } },
      stringArray: [],
    });
    expect(id.decRange.end.value.toString()).to.eql('');

    id.__reset();
    expect(id.__toLiteral()).to.eql({
      id: 'init',
      stringArray: [],
    });
    id.decRange = { start: { value: '444.4' } };
    id.decRange.end = { value: '555.4' };
    expect(id.__toLiteral()).to.eql({
      decRange: { start: { value: '444.4' }, end: { value: '555.4' } },
      id: 'init',
      stringArray: [],
    });

    id.decRange.start = { value: '1' };
    expect(id.__toLiteral()).to.eql({
      decRange: { start: { value: '1' }, end: { value: '555.4' } },
      id: 'init',
      stringArray: [],
    });
  });

  it('should reset to an empty state if initialized so', async () => {
    const id = new Identifier();
    id.bookingCenter = BookingCenter.BBC_SG;
    expect(id.__toLiteral()).to.eql({
      bookingCenter: BookingCenter.BBC_SG,
      stringArray: [
        // from the default
        'A',
        'B',
        'C',
      ],
    });

    id.__reset();
    id.id = 'stringliteral';
    expect(id.__toLiteral()).to.eql({
      id: 'stringliteral',
      bookingCenter: BookingCenter.BOOKING_CENTER_UNSPECIFIED,
      stringArray: [
        // from the default
        'A',
        'B',
        'C',
      ],
    });
    id.__reset();
    expect(id.__toLiteral()).to.eql({
      bookingCenter: BookingCenter.BOOKING_CENTER_UNSPECIFIED,
      stringArray: ['A', 'B', 'C'],
    });
  });

  it('should reset to an empty state if initialized so (with ARRAY child)', async () => {
    const fat = new XString();
    expect(fat.__toLiteral()).to.eql({});

    //  fat.labels.set('stringliteral',true);

    expect(fat.__toLiteral()).to.eql({});
    expect(fat.__stringify()).to.eql('{}');

    fat.__reset();
    expect(fat.__toLiteral()).to.eql({});
    expect(fat.__stringify()).to.eql('{}');
  });

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
    expect(id.id.__rootNode).to.eql(id);
    expect(id.decRange.start.value.__rootNode).to.eql(id);
  });
});
