import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import type { IIdentifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { BookingCenter } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/BookingCenter';
import { expect } from '@open-wc/testing';

const initData: IIdentifier = {
  id: 'events',
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

describe('Node events', () => {
  it('should notify model-injected after init or fromLiteral', done => {
    const id = new Identifier();

    id.__addEventListener('model-injected', () => {
      done();
    });

    id.__fromLiteral(initData);
    expect(id.id.toString()).to.equal('events');
  });

  it('should notify field changes on each field when injecting data', done => {
    const id = new Identifier();

    id.id.__addEventListener('this-field-value-changed', () => {
      done();
    });

    id.__fromLiteral(initData);
    expect(id.id.toString()).to.equal('events');
  });

  it('should bubble field changes after modifying fields', done => {
    const id = new Identifier();

    id.__fromLiteral(initData);
    id.__addEventListener('field-value-changed', e => {
      expect(e.detail).to.equal(id.id);
      done();
    });

    expect(id.id.toString()).to.equal('events');
    id.id = 'some text';
  });

  it('should trigger events with once only once ', done => {
    const id = new Identifier();
    let i = 0;
    id.__addEventListener(
      'this-field-value-changed',
      () => {
        i += 1;
        // check ANY, it bubbles too much on init.
        // first change is from __fromLiteral on id itself
        expect(i).to.equal(1);
        // expect(e.detail.id.__parentNode).to.equal(id.__parentNode);
        done();
      },
      { once: true },
    );

    id.__fromLiteral(initData);
    expect(id.id.toString()).to.equal('events');
    id.id = 'some text';
  });

  it('should be possible to remove event listener', async () => {
    const id = new Identifier();

    const handler = () => {
      // should never happen
      expect(true).to.be.false;
    };

    id.__addEventListener('field-value-changed', handler);
    id.__removeEventListener('field-value-changed', handler);

    id.__fromLiteral(initData);
    expect(id.id.toString()).to.equal('events');
    id.id = 'some text';
    expect(id.id.toString()).to.equal('some text');
  });

  it('should broadcast events to every children in full depth to ENUM ', done => {
    const id = new Identifier();
    const handler = () => {
      id.bookingCenter.__removeCustomEventListener('broadcast', handler);
      done();
    };
    id.bookingCenter.__addCustomEventListener('broadcast', handler);

    id.__fromLiteral(initData);
    id.__broadcastEvent(new CustomEvent('broadcast'));
    id.__broadcastEvent(new CustomEvent('broadcast'));
  });

  it('should broadcast events to every children in full depth to ARRAY ', done => {
    const id = new Identifier();
    id.__fromLiteral(initData);

    id.repeatedDecimal.value[0].value.__addCustomEventListener(
      'broadcast',
      () => {
        done();
      },
    );

    id.__broadcastEvent(new CustomEvent('broadcast'));
  });

  it('should broadcast events to every children in full depth to MAP ', done => {
    const id = new Identifier();
    id.__fromLiteral(initData);

    id.attributes.get('key')!.__addCustomEventListener('broadcast', () => {
      done();
    });

    id.__broadcastEvent(new CustomEvent('broadcast'));
  });
  it('should broadcast events to every children in full depth to ANY ', done => {
    const id = new Identifier();
    id.__fromLiteral(initData);

    (id.any.value as Identifier).id.__addCustomEventListener(
      'broadcast',
      () => {
        done();
      },
    );

    id.__broadcastEvent(new CustomEvent('broadcast'));
  });
});
