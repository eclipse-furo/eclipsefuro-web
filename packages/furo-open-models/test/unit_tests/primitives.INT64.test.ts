import { expect } from '@open-wc/testing';
import type { INumeric64 } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric64';
import { Numeric64 } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric64';

import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

const initData: INumeric64[] = [
  {
    primitiveInt64: '3442',
    repeatedPrimitiveInt64: ['1', '2', '3', '4'],
    primitiveInt64Excl: '5',
  },
  {},
  {
    primitiveInt64: '0',
    repeatedPrimitiveInt64: ['0', '0', '0', '0'],
  },
];

describe('primitives INT64 type', () => {
  it('must check constraints', async () => {
    const numeric = new Numeric64(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 1000 3442',
    );
    numeric.primitiveInt64Excl = 1990n;
    expect(numeric.primitiveInt64Excl.__meta.stateMessage).to.equal(
      'constraint.violation.maximum 1000 1990',
    );

    numeric.primitiveInt64 = 990n;
    expect(numeric.primitiveInt64.__isValid).to.be.true;

    numeric.primitiveInt64 = 996n;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64.__meta.stateMessage).to.equal(
      'constraint.violation.multiple_of 5 996',
    );

    numeric.primitiveInt64 = -5n;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 5 -5',
    );

    numeric.primitiveInt64Excl = -5n;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64Excl.__meta.stateMessage).to.equal(
      'constraint.violation.minimum 5 -5',
    );

    numeric.primitiveInt64 = 10n;
    numeric.primitiveInt64Excl = 10n;
    expect(numeric.__isValid).to.be.true;

    numeric.primitiveInt64 = 1000n;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 1000 1000',
    );

    numeric.primitiveInt64 = 5n;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt64.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 5 5',
    );

    expect(numeric.primitiveInt64.valueOf()).to.equal(5n);

    numeric.repeatedPrimitiveInt64.__clear();
    expect(numeric.__toJson()).to.eql({
      primitive_int64: '5',
      primitive_int64_excl: '10',
    });

    numeric.__fromProtoNameJson({ primitive_int64: 0 });
    expect(numeric.primitiveInt64.valueOf()).to.equal(0n);

    // inner setter
    numeric.primitiveInt64.value = 10n;
    expect(numeric.__isValid).to.be.true;
  });

  it('must reset the value state after __fromProtoNameJson', async () => {
    const numeric = new Numeric64(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;

    numeric.__fromProtoNameJson({ primitive_int64: '0' });
    expect(numeric.primitiveInt64.valueOf()).to.equal(0n);
    // todo: clarify if __fromProtoNameJson resets the validity
    expect(numeric.__isValid).to.be.true;
    expect(numeric.primitiveInt64.__meta.valueState, 'state is reset').to.equal(
      'None',
    );
    expect(
      numeric.primitiveInt64.__meta.stateMessage,
      'state is reset',
    ).to.equal('');
  });

  it('must  reset the value state after __fromLiteral', async () => {
    const numeric = new Numeric64(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;

    numeric.__fromLiteral({ primitiveInt64: 0 });
    expect(numeric.primitiveInt64.valueOf()).to.equal(0n);
    // todo: clarify if __fromProtoNameJson resets the validity
    expect(numeric.__isValid).to.be.true;
    expect(
      numeric.primitiveInt64.__meta.stateMessage,
      'state is reset',
    ).to.equal('');
    expect(numeric.primitiveInt64.__meta.valueState, 'state is reset').to.equal(
      'None',
    );
  });

  it('must accept a number[] on repeated INT64', async () => {
    const numeric = new Numeric64(initData[2]);
    numeric.repeatedPrimitiveInt64 = [3n, 4n, 5n, 6n, 7n];
    expect(numeric.repeatedPrimitiveInt64.__toLiteral()).to.eql([
      '3',
      '4',
      '5',
      '6',
      '7',
    ]);
    expect(numeric.repeatedPrimitiveInt64.length).to.eql(5);
  });

  it('must return an Array with values even on 0 vals', async () => {
    const numeric = new Numeric64(initData[2]);
    expect(
      numeric.repeatedPrimitiveInt64.length,
      'literal array with 0 vals',
    ).to.eql(4);
    expect(numeric.repeatedPrimitiveInt64.__isEmpty, '__isEmpty').to.equal(
      false,
    );
    expect(
      numeric.repeatedPrimitiveInt64.__toLiteral(),
      'literal array with 0 vals',
    ).to.eql(['0', '0', '0', '0']);
    expect(numeric.__toJson().repeated_primitive_int64).to.eql([
      '0',
      '0',
      '0',
      '0',
    ]);
  });

  it('should not return  on 0 values', async () => {
    const numeric = new Numeric64(initData[2]);
    expect(numeric.primitiveInt64.__isEmpty, '__isEmpty').to.equal(true);
    expect(numeric.__toJson().primitive_int64).to.equal(undefined);
  });

  it('should return  on non 0 values', async () => {
    const numeric = new Numeric64(initData[2]);
    numeric.primitiveInt64 = 5n;
    expect(numeric.primitiveInt64.__isEmpty, '__isEmpty').to.equal(false);
    expect(numeric.__toJson().primitive_int64).to.equal('5');
  });

  it('must return a 0 string on __stringify when EmitDefaultValues option is set', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const numeric = new Numeric64(initData[2]);
    expect(numeric.primitiveInt64.__isEmpty, '__isEmpty').to.equal(false);
    expect(numeric.__toJson().primitive_int64).to.equal('0');
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('must have a default value of 0', async () => {
    const numeric = new Numeric64(initData[1]);
    expect(numeric.primitiveInt64.value).eql(0n);
  });

  it('must print a correct toString', async () => {
    const numeric = new Numeric64(initData[0]);
    expect(numeric.primitiveInt64.toString()).eql('3442');
  });
});
