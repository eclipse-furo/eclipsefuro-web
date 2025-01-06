import { expect } from '@open-wc/testing';

import { Tree } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Tree';
import type { ITree } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Tree';
import { DeepRecursion } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/DeepRecursion';
import type { IDeepRecursion } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/DeepRecursion';

const initData: ITree[] = [
  {
    displayName: 'A',
    recursion: {
      displayName: 'B',
      nodes: [
        {
          displayName: 'In recursion Array',
        },
      ],
      recursion: {
        displayName: 'C',
        recursion: {
          displayName: 'D',
        },
      },
    },
  },
];

const deep: IDeepRecursion = {
  displayName: 'A',
  field: { recursion: { displayName: 'B' } },
};

describe('Recursion', () => {
  it('should create an nested recursion', async () => {
    const tree = new DeepRecursion(deep);
    expect(tree.__isPristine).equal(true);
    expect(tree.__toLiteral()).to.eql(deep);
  });

  it('should return the content of display_name on toString', async () => {
    const tree = new DeepRecursion(deep);
    expect(tree.toString()).equal('A');
  });

  it('should  assign a literal to a recursion field', async () => {
    const tree = new DeepRecursion();
    tree.field = { recursion: { displayName: 'B' } };
    tree.displayName = 'A';
    expect(tree.__isPristine).equal(false);
    expect(tree.__toLiteral()).to.eql(deep);
  });

  it('should assign a literal to a recursion field inside a recursion ', async () => {
    const tree = new DeepRecursion();
    tree.field = { recursion: { displayName: 'B' } };
    tree.displayName = 'A';
    expect(tree.__toLiteral()).to.eql(deep);

    tree.field.value!.recursion.value!.field = {
      recursion: {
        displayName: 'C',
        field: { recursion: { displayName: 'D' } },
      },
    };

    expect(tree.__isPristine).equal(false);
    expect(tree.__toLiteral()).to.eql({
      displayName: 'A',
      field: {
        recursion: {
          displayName: 'B',
          field: {
            recursion: {
              displayName: 'C',
              field: {
                recursion: {
                  displayName: 'D',
                },
              },
            },
          },
        },
      },
    });
  });

  it('should assign a literal to a cross recursion field inside a recursion ', async () => {
    const tree = new DeepRecursion();
    tree.field = { recursion: { displayName: 'B' } };
    tree.displayName = 'A';
    tree.field.value!.recursion = {
      displayName: 'Bx',
      field: { recursion: { displayName: 'Cx' } },
    };
    expect(tree.__toLiteral()).to.eql({
      displayName: 'A',
      field: {
        recursion: {
          displayName: 'Bx',
          field: {
            recursion: {
              displayName: 'Cx',
            },
          },
        },
      },
    });
  });

  it('should return correct json data', async () => {
    const tree = new DeepRecursion(deep);
    expect(tree.__isPristine).equal(true);
    expect(tree.__toJson()).to.eql({
      display_name: 'A',
      field: { recursion: { display_name: 'B' } },
    });
  });

  it('should create an empty object', async () => {
    const tree = new Tree({ displayName: 'display' });
    expect(tree.__isPristine).equal(true);
  });

  it('should create a initial tree', async () => {
    const tree = new Tree(initData[0]);

    expect(tree.displayName.toString()).to.eql('A');
    expect(tree.recursion.value!.displayName.toString()).to.eql('B');
    expect(
      tree.recursion.value!.recursion.value!.displayName.toString(),
    ).to.eql('C');

    expect(tree.__isPristine).equal(true);
    expect(tree.__toLiteral()).to.eql(initData[0]);
  });

  it('should return a correct path', async () => {
    const tree = new Tree(initData[0]);
    expect(tree.recursion.value!.recursion.value!.displayName.toString()).equal(
      'C',
    );
    expect(
      tree.recursion.value!.recursion.value!.recursion.value!.displayName.toString(),
    ).equal('D');
    expect(
      tree.recursion.value!.recursion.value!.recursion.value!.displayName
        .__label,
    ).equal('FURO_TYPE_TREE_DISPLAY_NAME_LABEL');
    expect(tree.recursion.value!.recursion.value!.recursion.__label).equal(
      'FURO_TYPE_TREE_RECURSION_LABEL',
    );
    expect(tree.displayName.__fieldPath).equal('display_name');
    expect(
      tree.recursion.value!.recursion.value!.recursion.value!.displayName
        .__fieldPath,
    ).equal('recursion.recursion.recursion.display_name');
    expect(
      tree.recursion.value!.recursion.value!.recursion.value!.displayName
        .__label,
    ).equal('FURO_TYPE_TREE_DISPLAY_NAME_LABEL');
  });
});
