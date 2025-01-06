import { expect } from '@open-wc/testing';
import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

import { type ValueStateSummary, ValueState } from '@furo/open-models/dist';

describe('ValueStates', () => {
  it('should return all states', async () => {
    const defaults = new Defaults();
    defaults.__validate();
    expect(defaults.__isValid).to.be.false;
    expect(defaults.__getAllStates()).to.eql([
      {
        field: 'id',
        message: 'constraint.violation.pattern ^-*$ default',
        state: 'Error',
      },
      {
        field: 'repeated_decimal',
        message: 'constraint.violation.required',
        state: 'Error',
      },
    ]);
    defaults.repeatedDecimal.push({ value: '10' });
    defaults.__validate();

    expect(defaults.__getAllStates()).to.eql([
      {
        field: 'id',
        message: 'constraint.violation.pattern ^-*$ default',
        state: 'Error',
      },
    ]);
  });

  it('should apply value states', done => {
    const defaults = new Defaults();

    const s: ValueStateSummary[] = [
      {
        field: 'id',
        state: ValueState.Error,
        message: 'constraint.violation.pattern ^-*$',
      },
      {
        field: 'repeated_decimal[0]',
        state: ValueState.Error,
        message: 'DEC',
      },
    ];
    defaults.repeatedDecimal.push({ value: '10' });
    defaults.__applyValueStates(...s);
    expect(defaults.id.__meta.valueState).to.eql('Error');
    expect(defaults.id.__meta.stateMessage).to.eql(
      'constraint.violation.pattern ^-*$',
    );
    expect(defaults.repeatedDecimal.at(0)!.__meta.valueState).to.eql('Error');
    expect(defaults.repeatedDecimal.at(0)!.__meta.stateMessage).to.eql('DEC');
    done();
  });
});