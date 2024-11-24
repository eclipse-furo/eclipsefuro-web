import { ToString, ValueOf } from '@furo/open-models/dist';
import { CubeEntity } from './furo/cube/CubeEntity';
import { Colour } from './furo/cube/Colour';
import { Decimal } from './furo/type/Decimal';
import { DecimalRange } from './furo/type/DecimalRange';
import { Identifier } from './furo/type/Identifier';

/**
 * In this file, we set the toString() and valueOf() methods for our types.
 */

ToString.set('furo.cube.CubeEntity', (d: CubeEntity) => d.displayName.value);

/**
 * Let the colour type return a 'rgba(22,22,22,1)' color, this can be directly used in the template literals
 */
ToString.set(
  'furo.cube.Colour',
  (d: Colour) =>
    `rgba(${d.red.value}, ${d.green.value}, ${
      d.blue.value
    }, ${d.alpha.value.toFixed(2)})`,
);

// Returns the volume of the cube. This comes very handy if you use it in calculations.
ValueOf.set(
  'furo.cube.CubeEntity',
  (d: CubeEntity) =>
    d.cube.height.value * d.cube.breadth.value * d.cube.length.value,
);

ToString.set('furo.type.Decimal', (d: Decimal) => d.value.value);
ValueOf.set('furo.type.Decimal', (d: Decimal) => parseFloat(d.value.value));

ToString.set(
  'furo.type.DecimalRange',
  (d: DecimalRange) => `${d.start} - ${d.end}`,
);
ToString.set('furo.type.Identifier', (v: Identifier) => `${v.id}`);
ToString.set('furo.type.Defaults', (v: Identifier) => `${v.id}`);
