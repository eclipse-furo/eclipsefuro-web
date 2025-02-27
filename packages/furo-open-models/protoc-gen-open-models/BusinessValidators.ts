import { Validators } from '@furo/open-models/dist/Validator';
import { ValueState, type ValueStateSummary } from '@furo/open-models/dist';
import { CubeDefinition } from './furo/cube/CubeDefinition';

import { DecimalRange } from './furo/type/DecimalRange';
import { Defaults } from './furo/type/Defaults';
import { Decimal } from './furo/type/Decimal';

Validators.set('furo.type.DecimalRange', (node: DecimalRange) => {
  if (
    parseFloat(node.start.value.toString()) >
    parseFloat(node.end.value.toString())
  ) {
    node.__setValueState(ValueState.Negative, [
      'decimal.start.must.be.smaller.then.end',
    ]);
  } else {
    node.__setValueState(ValueState.None, ['']);
  }
});

Validators.set('furo.type.Defaults', (node: Defaults) => {
  if (node.id.value === '----') {
    node.id.__setValueState(ValueState.Negative, [
      'defaults.id.can.not.be.4',
      '----',
    ]);
  } else {
    node.__setValueState(ValueState.None, ['']);
  }
});

Validators.set('furo.type.Decimal', (node: Decimal) => {
  if (!node.value.value.match(/^[+-]?(\d*\.)?\d+$/)) {
    // maybe ^[+-]?(\d*\.)?\d*$   ???
    node.__setValueState(ValueState.Negative, [
      'decimal.invalid.number',
      node.value.value,
    ]);
  } else {
    const fieldConstraints = node.__getConstraints();
    if (fieldConstraints) {
      for (const [constraint, value] of Object.entries(fieldConstraints)) {
        if (constraint === 'minimum') {
          if (parseFloat(node.value.value) < value) {
            node.__setValueState(ValueState.Negative, [
              'constraint.violation.minimum',
              value,
              node.value.value,
            ]);
            return;
          }
        }
      }
    }

    node.__setValueState(ValueState.None, ['']);
  }
});

Validators.set('furo.cube.CubeDefinition', (cube: CubeDefinition) => {
  // make sure the cubes are cube-ish enough
  /**
   * Implemented Business Validators
   * To ensure that we have a good cube, following business validators are implemented:
   * When l == b == h, we have a perfect cube (value state "Success").
   * When we have a deviation of 10% to the average sizes, we recommend adjusting the deviating values (value state "Informative").
   * When we have a deviation of 20% to the average sizes, we strongly recommend adjusting the deviating values (value state "Warning").
   * When we have a deviation of 30% to the average sizes, we force adjusting the deviating values (value state "Error").
   */
  const valueStateSummary: ValueStateSummary[] = [];
  const avg = (cube.length.value + cube.breadth.value + cube.height.value) / 3;

  let isValid = true;

  if (cube.length.value >= 100 && cube.length.value <= 1000) {
    const lengthState: ValueStateSummary = {
      field: 'length',
      message: '',
      state: ValueState.None,
    };

    if (cube.length.value < avg * 0.9) {
      lengthState.state = ValueState.Information;
      lengthState.message =
        'Please consider to make this value bigger, to have a perfect cube';
    }
    if (cube.length.value < avg * 0.8) {
      lengthState.state = ValueState.Critical;
      lengthState.message =
        'A perfect cube should have the same length, breadth and height.\n It is strongly recommended to increase this value';
    }
    if (cube.length.value < avg * 0.7) {
      lengthState.state = ValueState.Negative;
      lengthState.message =
        'A perfect cube should have the same length, breadth and height.\n Increase this value';
      isValid = false;
    }
    if (
      cube.length.value === cube.breadth.value &&
      cube.length.value === cube.height.value
    ) {
      lengthState.state = ValueState.Positive;
    }
    if (cube.length.value > avg * 1.1) {
      lengthState.state = ValueState.Information;
      lengthState.message =
        'Please consider to make this value smaller, to have a perfect cube';
    }
    if (cube.length.value > avg * 1.2) {
      lengthState.state = ValueState.Critical;
      lengthState.message =
        'A perfect cube should have the same length, breadth and height.\n It is strongly recommended to decrease this value';
    }
    if (cube.length.value > avg * 1.3) {
      lengthState.state = ValueState.Negative;
      lengthState.message =
        'A perfect cube should have the same length, breadth and height.\n Decrease this value';
      isValid = false;
    }
    valueStateSummary.push(lengthState);
  }

  if (cube.breadth.value >= 100 && cube.breadth.value <= 1000) {
    const breadthState: ValueStateSummary = {
      field: 'breadth',
      message: '',
      state: ValueState.None,
    };

    if (cube.breadth.value < avg * 0.9) {
      breadthState.state = ValueState.Information;
      breadthState.message =
        'Please consider to make this value bigger, to have a perfect cube';
    }

    if (cube.breadth.value < avg * 0.8) {
      breadthState.state = ValueState.Critical;
      breadthState.message =
        'A perfect cube should have the same breadth, breadth and height.\n It is strongly recommended to increase this value';
    }
    if (cube.breadth.value < avg * 0.7) {
      breadthState.state = ValueState.Negative;
      breadthState.message =
        'A perfect cube should have the same breadth, breadth and height.\n Increase this value';
      isValid = false;
    }
    if (
      cube.length.value === cube.breadth.value &&
      cube.length.value === cube.height.value
    ) {
      breadthState.state = ValueState.Positive;
    }
    if (cube.breadth.value > avg * 1.1) {
      breadthState.state = ValueState.Information;
      breadthState.message =
        'Please consider to make this value smaller, to have a perfect cube';
    }
    if (cube.breadth.value > avg * 1.2) {
      breadthState.state = ValueState.Critical;
      breadthState.message =
        'A perfect cube should have the same breadth, breadth and height.\n It is strongly recommended to decrease this value';
    }
    if (cube.breadth.value > avg * 1.3) {
      breadthState.state = ValueState.Negative;
      breadthState.message =
        'A perfect cube should have the same breadth, breadth and height.\n Decrease this value';
      isValid = false;
    }
    valueStateSummary.push(breadthState);
  }

  if (cube.height.value >= 100 && cube.height.value <= 1000) {
    const heightState: ValueStateSummary = {
      field: 'height',
      message: '',
      state: ValueState.None,
    };

    if (cube.height.value < avg * 0.9) {
      heightState.state = ValueState.Information;
      heightState.message =
        'Please consider to make this value bigger, to have a perfect cube';
    }

    if (cube.height.value < avg * 0.8) {
      heightState.state = ValueState.Critical;
      heightState.message =
        'A perfect cube should have the same height, height and height.\n It is strongly recommended to increase this value';
    }
    if (cube.height.value < avg * 0.7) {
      heightState.state = ValueState.Negative;
      heightState.message =
        'A perfect cube should have the same height, height and height.\n Increase this value';
      isValid = false;
    }
    if (
      cube.length.value === cube.breadth.value &&
      cube.length.value === cube.height.value
    ) {
      heightState.state = ValueState.Positive;
    }
    if (cube.height.value > avg * 1.1) {
      heightState.state = ValueState.Information;
      heightState.message =
        'Please consider to make this value smaller, to have a perfect cube';
    }
    if (cube.height.value > avg * 1.2) {
      heightState.state = ValueState.Critical;
      heightState.message =
        'A perfect cube should have the same height, breadth and height.\n It is strongly recommended to decrease this value';
    }
    if (cube.height.value > avg * 1.3) {
      heightState.state = ValueState.Negative;
      heightState.message =
        'A perfect cube should have the same height, breadth and height.\n Decrease this value';
      isValid = false;
    }
    valueStateSummary.push(heightState);
  }

  cube.__applyValueStates(...valueStateSummary);

  // set the validity of the entity itself
  cube.__setValidState(isValid);
});
