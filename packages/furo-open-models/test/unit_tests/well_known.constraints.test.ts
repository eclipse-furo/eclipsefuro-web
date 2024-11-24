import { expect } from '@open-wc/testing';

import { Int32Value } from '@furo/open-models/dist/well_known/Int32Value';
import { ConstraintWrappers } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/ConstraintWrappers';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

describe('well known constraints', () => {
  it('should send correct json on empty', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const wr = new ConstraintWrappers({});
    expect(wr.__toJson()).to.eql({
      bool_value: false,
      bytes_value: '',
      float_value: 0,
      double_value: 0,
      int32_value: 3,
      int64_value: 3,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
      uint32_value: 0,
      uint64_value: 0,
    });
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('should send all empty fields when EmitDefaultValues is on', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const wr = new ConstraintWrappers();
    expect(wr.__toJson()).to.eql({
      bool_value: false,
      bytes_value: '',
      double_value: 0,
      float_value: 0,
      int32_value: 3,
      int64_value: 3,
      uint32_value: 0,
      uint64_value: 0,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('should not send null fields when emitDefault is false', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new ConstraintWrappers();
    expect(wr.__toJson()).to.eql({
      int32_value: 3,
      int64_value: 3,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
    wr.__clear();
    expect(wr.__toJson()).to.eql({
      int32_value: 0,
      int64_value: 0,
      string_value: '',
    });
    wr.__validate();
    expect(wr.int32Value.__isValid).to.be.false;
    expect(wr.__isValid).to.be.false;
    expect(wr.int32Value.__meta.stateMessage).to.equal(
      'constraint.violation.minimum 3 0',
    );
  });

  it('should send correct json on empty and data when not', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new ConstraintWrappers({ int32Value: 123 });
    expect(wr.__toJson()).to.eql({
      excl_int32_value: 3,
      excl_int64_value: 3,
      int32_value: 123,
      int64_value: 3,
      string_value: 'default',
    });
  });

  it('should init with an number', async () => {
    const wr = new ConstraintWrappers({ int32Value: 123 });
    expect(wr.int32Value.valueOf()).to.equal(123);
    expect(wr.int32Value.toString()).to.equal('123');
    expect(wr.__toJson()).to.eql({
      int32_value: 123,
      int64_value: 3,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
    expect(wr.__toLiteral()).to.eql({
      int32Value: 123,
      int64Value: 3,
      exclInt32Value: 3,
      exclInt64Value: 3,
      stringValue: 'default',
    });
    expect(wr.__isValid).to.be.true;
  });

  it('should validate int32', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new ConstraintWrappers({});
    expect(wr.int32Value.value).to.equal(3);
    expect(wr.__isValid).to.be.true;
    expect(wr.__toJson()).to.eql({
      int32_value: 3,
      int64_value: 3,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
    wr.__validate();
    expect(wr.__isValid).to.be.false;
    expect(wr.int64Value._value).to.equal(3);
    wr.int64Value = 0;
    expect(wr.int64Value.__isValid).to.be.false;

    wr.int32Value = 0;
    expect(wr.int32Value.__meta.stateMessage).to.equal(
      'constraint.violation.minimum 3 0',
    );
    wr.exclInt32Value = 0;
    expect(wr.exclInt32Value.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 3 0',
    );

    wr.exclInt64Value = 0;
    expect(wr.exclInt64Value.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 3 0',
    );

    wr.int32Value = 3;
    expect(wr.int32Value.__meta.stateMessage).to.equal('');

    wr.int32Value = 9;
    expect(wr.int32Value.__meta.stateMessage).to.equal('');

    wr.int32Value = 10;
    expect(wr.int32Value.__meta.stateMessage).to.equal(
      'constraint.violation.multiple_of 3 10',
    );

    wr.int32Value = 12;
    expect(wr.int32Value.__meta.stateMessage).to.equal(
      'constraint.violation.maximum 10 12',
    );
    wr.exclInt32Value = 12;
    expect(wr.exclInt32Value.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 10 12',
    );
  });

  it('should validate int64', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new ConstraintWrappers({});

    expect(wr.int64Value.value).to.equal(3);
    expect(wr.__isValid).to.be.true;
    expect(wr.__toJson()).to.eql({
      int32_value: 3,
      int64_value: 3,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
    wr.__validate();
    expect(wr.__isValid).to.be.false;
    expect(wr.int64Value._value).to.equal(3);
    wr.int64Value = 4;
    expect(wr.int64Value.__isValid).to.be.false;
    expect(wr.int64Value.__meta.stateMessage).to.equal(
      'constraint.violation.multiple_of 3 4',
    );

    wr.int64Value = 0;
    expect(wr.int64Value.__meta.stateMessage).to.equal(
      'constraint.violation.minimum 3 0',
    );
    wr.exclInt64Value = 0;
    expect(wr.exclInt64Value.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_minimum 3 0',
    );
    wr.int64Value = 3;
    expect(wr.int64Value.__meta.stateMessage).to.equal('');

    wr.int64Value = 9;
    expect(wr.int64Value.__meta.stateMessage).to.equal('');

    wr.int64Value = 10;
    expect(wr.int64Value.__meta.stateMessage).to.equal(
      'constraint.violation.multiple_of 3 10',
    );

    wr.int32Value = 12;
    wr.int64Value = 12;
    wr.int64Value.value = 12;
    expect(wr.int64Value.__meta.stateMessage).to.equal(
      'constraint.violation.maximum 10 12',
    );
    wr.exclInt64Value.value = 12;
    expect(wr.exclInt64Value.__meta.stateMessage).to.equal(
      'constraint.violation.exclusive_maximum 10 12',
    );
    expect(wr.int64Value.toString()).to.equal('12');
    expect(wr.int64Value.valueOf() * wr.int32Value.valueOf()).to.equal(144);
  });

  it('should send correct json', async () => {
    const wr = new ConstraintWrappers({
      int32Value: 123,
      int64Value: 42,
    });
    expect(wr.__toJson()).to.eql({
      int32_value: 123,
      int64_value: 42,
      excl_int32_value: 3,
      excl_int64_value: 3,
      string_value: 'default',
    });
  });

  it('Int32Value should init with an number', async () => {
    const ival = new Int32Value(1);
    expect(ival.toString()).to.equal('1');
    expect(ival.valueOf()).to.equal(1);
    expect(ival.__isValid).to.be.true;
  });

  it('Int32Value should stay in range', async () => {
    const ival = new Int32Value(2147483648);
    ival.__validate();
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.max 2147483647',
    );
  });

  it('Int32Value should stay in range', async () => {
    const ival = new Int32Value();
    ival.value = 2147483648;
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.max 2147483647',
    );
  });

  it('Int32Value should stay in range', async () => {
    const ival = new Int32Value(-2147483649);
    ival.__validate();
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.min -2147483648',
    );
  });

  it('Int32Value should stay in range max', async () => {
    const ival = new Int32Value();
    ival.value = -2147483649;
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.min -2147483648',
    );
  });

  it('Int32Value should stay in range min', async () => {
    const ival = new Int32Value();
    ival.value = -2147483649;
    expect(ival.__isValid).to.be.false;
    expect(ival.__meta.stateMessage).to.equal(
      'constraint.violation.range.int32.min -2147483648',
    );
  });

  it('Int32Value should set number from literal', async () => {
    const ival = new Int32Value();
    ival.__fromLiteral(1234);
    expect(ival.__isValid).to.be.true;
    expect(ival.valueOf()).to.equal(1234);
  });
});
