import { expect } from '@open-wc/testing';

import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { OPEN_MODELS_OPTIONS } from '@furo/open-models/dist/OPEN_MODELS_OPTIONS';

describe('EmitUnpopulated.test.ts', () => {
  it('should EmitUnpopulated fields', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = true;
    const id = new Identifier({ fatString: { value: '' } });
    expect(id.__toJson()).to.eql({
      booking_center: 'BOOKING_CENTER_UNSPECIFIED',
      id: '',
      ref_system: 'REF_SYSTEM_UNSPECIFIED',
      ref_type: 'REF_TYPE_UNSPECIFIED',
      attributes: {},
      string_array: ['A', 'B', 'C'],
      dec_range: null,
      any: null,
      repeated_decimal: [],
      fat_string: { value: '', attributes: {}, labels: {} },
      true_false: false,
    });
  });

  it('should EmitDefaultValues fields', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const id = new Identifier();
    expect(id.__toJson()).to.eql({
      booking_center: 'BOOKING_CENTER_UNSPECIFIED',
      ref_system: 'REF_SYSTEM_UNSPECIFIED',
      ref_type: 'REF_TYPE_UNSPECIFIED',

      id: '',
      attributes: {},
      string_array: ['A', 'B', 'C'],
      repeated_decimal: [],
      true_false: false,
    });
  });

  it('should only updated fields of fields with values', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const id = new Identifier();
    id.id = 'changed';
    expect(id.__toJson()).to.eql({
      id: 'changed',
      string_array: ['A', 'B', 'C'],
    });
  });

  it('should EmitUnpopulated fields after some changes', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = true;
    const id = new Identifier();
    id.id = 'changed';
    expect(id.__toJson()).to.eql({
      booking_center: 'BOOKING_CENTER_UNSPECIFIED',
      ref_system: 'REF_SYSTEM_UNSPECIFIED',
      ref_type: 'REF_TYPE_UNSPECIFIED',

      id: 'changed',
      attributes: {},
      string_array: ['A', 'B', 'C'],
      dec_range: null,
      any: null,
      repeated_decimal: [],
      fat_string: null,
      true_false: false,
    });
  });

  it('should EmitDefaultValues fields after some changes', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
    OPEN_MODELS_OPTIONS.EmitDefaultValues = true;
    const id = new Identifier();
    id.id = 'changed';
    expect(id.__toJson()).to.eql({
      booking_center: 'BOOKING_CENTER_UNSPECIFIED',
      ref_system: 'REF_SYSTEM_UNSPECIFIED',
      ref_type: 'REF_TYPE_UNSPECIFIED',
      id: 'changed',
      attributes: {},
      string_array: ['A', 'B', 'C'],
      repeated_decimal: [],
      true_false: false,
    });
  });

  it('should only updated fields after some changes', async () => {
    OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    const id = new Identifier();
    id.id = 'changed';
    id.fatString.value = 'changed';
    id.stringArray.__clear();
    expect(id.__toJson()).to.eql({
      id: 'changed',
      fat_string: { value: 'changed' },
      string_array: [],
    });
  });
});
