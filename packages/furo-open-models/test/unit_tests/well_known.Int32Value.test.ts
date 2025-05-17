import { expect } from '@open-wc/testing';

import { Int32Value } from '@furo/open-models/dist/well_known/Int32Value';
import { Wrappers } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Wrappers';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

describe('well known Int32Value', () => {
  it('should send correct json on empty', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const wr = new Wrappers({});
    expect(wr.__toJson()).to.eql({
      bool_value: false,
      bytes_value: '',
      double_value: 0,
      float_value: 0,
      int32_value: 0,
      int64_value: '0',
      string_value: '',
      uint32_value: 0,
      uint64_value: 0,
    });
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('should send all empty fields when EmitDefaultValues is on', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const wr = new Wrappers();
    expect(wr.__toJson()).to.eql({
      bool_value: false,
      bytes_value: '',
      double_value: 0,
      float_value: 0,
      int32_value: 0,
      int64_value: '0',
      string_value: '',
      uint32_value: 0,
      uint64_value: 0,
    });
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
  });

  it('should not send null fields when emitDefault is false', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new Wrappers();
    expect(wr.__toJson()).to.eql({});
  });

  it('should send correct json on empty and data when not', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new Wrappers({ int32Value: 123 });
    expect(wr.__toJson()).to.eql({ int32_value: 123 });
  });

  it('should init with an number', async () => {
    const wr = new Wrappers({ int32Value: 123 });
    expect(wr.int32Value.valueOf()).to.equal(123);
    expect(wr.int32Value.toString()).to.equal('123');
    expect(wr.__toJson()).to.eql({ int32_value: 123 });
    expect(wr.__toLiteral()).to.eql({ int32Value: 123 });
    expect(wr.__isValid).to.be.true;
  });

  it('should init empty', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new Wrappers({});
    expect(wr.int32Value.value).to.equal(0);
    wr.int32Value = 1233;
    expect(wr.int32Value.toString()).to.equal('1233');

    expect(wr.__toJson()).to.eql({ int32_value: 1233 });

    wr.int32Value = 0;
    expect(wr.__toJson()).to.eql({ int32_value: 0 });
    expect(wr.__isValid).to.be.true;

    // if set to null, do not send
    wr.int32Value = null;
    expect(wr.__toJson()).to.eql({});
    expect(wr.__isValid).to.be.true;
  });

  it('should send correct json', async () => {
    const wr = new Wrappers({ int32Value: 123, int64Value: '42' });
    expect(wr.__toJson()).to.eql({ int32_value: 123, int64_value: '42' });
  });

  it('should send correct json on empty', async () => {
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const wr = new Wrappers();
    expect(wr.__toJson()).to.eql({});
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
