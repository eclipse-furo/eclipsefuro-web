import { expect } from '@open-wc/testing';
import type { INumeric } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric';
import { Numeric } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric';

import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';
import { INT32 } from '@furo/open-models/dist';

const initData: INumeric[] = [
  {
    primitiveInt32: 3442,
    repeatedPrimitiveInt32: [1, 2, 3, 4],
  },
  {},
  {
    primitiveInt32: 0,
    repeatedPrimitiveInt32: [0, 0, 0, 0],
  },
];

describe('primitives INT32 type', () => {
  it('must check constraints', async () => {
    const numeric = new Numeric(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt32.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 1000 3442',
    );

    numeric.primitiveInt32 = 990;
    expect(numeric.primitiveInt32.__isValid).to.be.true;

    numeric.primitiveInt32 = 996;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt32.__meta.stateMessage).to.equal(
      'constraint.violation.multiple_of 5 996',
    );

    numeric.primitiveInt32 = -5;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt32.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 5 -5',
    );

    numeric.primitiveInt32 = 10;
    expect(numeric.__isValid).to.be.true;

    numeric.primitiveInt32 = 1000;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt32.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 1000 1000',
    );

    numeric.primitiveInt32 = 5;
    expect(numeric.__isValid).to.be.false;
    expect(numeric.primitiveInt32.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 5 5',
    );

    expect(numeric.primitiveInt32.valueOf()).to.equal(5);
    numeric.repeatedPrimitiveInt32.__clear();
    expect(numeric.__toJson()).to.eql({ primitive_int32: 5 });

    numeric.__fromProtoNameJson({ primitive_int32: 0 });
    expect(numeric.primitiveInt32.valueOf()).to.equal(0);

    // inner setter
    numeric.primitiveInt32.value = 10;
    expect(numeric.__isValid).to.be.true;
  });

  it('must reset the value state after __fromProtoNameJson', async () => {
    const numeric = new Numeric(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;

    numeric.__fromProtoNameJson({ primitive_int32: 0 });
    expect(numeric.primitiveInt32.valueOf()).to.equal(0);
    // todo: clarify if __fromProtoNameJson resets the validity
    expect(numeric.__isValid).to.be.true;
    expect(numeric.primitiveInt32.__meta.valueState, 'state is reset').to.equal(
      'None',
    );
    expect(
      numeric.primitiveInt32.__meta.stateMessage,
      'state is reset',
    ).to.equal('');
  });

  it('must  reset the value state after __fromLiteral', async () => {
    const numeric = new Numeric(initData[0]);
    expect(numeric.__isValid).to.be.true;
    numeric.__validate();
    expect(numeric.__isValid).to.be.false;

    numeric.__fromLiteral({ primitiveInt32: 0 });
    expect(numeric.primitiveInt32.valueOf()).to.equal(0);
    // todo: clarify if __fromProtoNameJson resets the validity
    expect(numeric.__isValid).to.be.true;
    expect(
      numeric.primitiveInt32.__meta.stateMessage,
      'state is reset',
    ).to.equal('');
    expect(numeric.primitiveInt32.__meta.valueState, 'state is reset').to.equal(
      'None',
    );
  });

  it('should stay in range', async () => {
    const ival = new INT32(2147483648);
    ival.__validate();
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.max 2147483647',
    );
  });

  it('should stay in range', async () => {
    const ival = new INT32();
    ival.value = 2147483648;
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.max 2147483647',
    );
  });

  it('should stay in range', async () => {
    const ival = new INT32(-2147483649);
    ival.__validate();
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.min -2147483648',
    );
  });

  it('should stay in range', async () => {
    const ival = new INT32();
    ival.value = -2147483649;
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.min -2147483648',
    );
  });

  it('must accept a number[] on repeated INT32', async () => {
    const numeric = new Numeric(initData[2]);
    numeric.repeatedPrimitiveInt32 = [3, 4, 5, 6, 7];
    expect(numeric.repeatedPrimitiveInt32.__toLiteral()).to.eql([
      3, 4, 5, 6, 7,
    ]);
    expect(numeric.repeatedPrimitiveInt32.length).to.eql(5);
  });

  it('must return an Array with values even on 0 vals', async () => {
    const numeric = new Numeric(initData[2]);
    expect(
      numeric.repeatedPrimitiveInt32.length,
      'literal array with 0 vals',
    ).to.eql(4);
    expect(numeric.repeatedPrimitiveInt32.__isEmpty, '__isEmpty').to.equal(
      false,
    );
    expect(
      numeric.repeatedPrimitiveInt32.__toLiteral(),
      'literal array with 0 vals',
    ).to.eql([0, 0, 0, 0]);
    expect(numeric.__toJson().repeated_primitive_int32).to.eql([0, 0, 0, 0]);
  });

  it('should not return  on 0 values', async () => {
    const numeric = new Numeric(initData[2]);
    expect(numeric.primitiveInt32.__isEmpty, '__isEmpty').to.equal(true);
    expect(numeric.__toJson().primitive_int32).to.equal(undefined);
  });

  it('should return  on non 0 values', async () => {
    const numeric = new Numeric(initData[2]);
    numeric.primitiveInt32 = 5;
    expect(numeric.primitiveInt32.__isEmpty, '__isEmpty').to.equal(false);
    expect(numeric.__toJson().primitive_int32).to.equal(5);
  });

  it('must return a 0 string on __stringify when EmitDefaultValues option is set', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const numeric = new Numeric(initData[2]);
    expect(numeric.primitiveInt32.__isEmpty, '__isEmpty').to.equal(false);
    expect(numeric.__toJson().primitive_int32).to.equal(0);
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('must have a default value of 0', async () => {
    const numeric = new Numeric(initData[1]);
    expect(numeric.primitiveInt32.value).eql(0);
  });

  it('must print a correct toString', async () => {
    const numeric = new Numeric(initData[0]);
    expect(numeric.primitiveInt32.toString()).eql('3442');
  });
});
