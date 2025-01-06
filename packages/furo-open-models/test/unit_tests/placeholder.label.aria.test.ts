import { Identifier } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Identifier';
import { expect } from '@open-wc/testing';

describe('Placeholders and labels', () => {
  it('should have deep labels (custom formater used)', async () => {
    const id = new Identifier({ id: 'init' });
    id.id = 'stringliteral';
    expect(id.fatString.attributes.__label).equal(
      'FURO_TYPE_IDENTIFIER_FAT_STRING_ATTRIBUTES_LABEL',
    );
    expect(id.fatString.__label).equal('FURO_TYPE_IDENTIFIER_FAT_STRING_LABEL');
  });
});
