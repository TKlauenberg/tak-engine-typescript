import { defineParameterType, Transform } from 'cucumber';
import { Direction } from '../../../lib';

const direction: Transform = {
  name: 'direction',
  // eslint-disable-next-line max-len
  regexp: /((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/,
  transformer: (x) => {
    // eslint-disable-next-line max-len
    const match =/((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/.exec(x)!;
    if (match[1] !== undefined) {
      return Direction.Up;
    } else if (match[2] !== undefined) {
      return Direction.Down;
    } else if (match[3] !== undefined) {
      return Direction.Right;
    } else {
      return Direction.Left;
    }
  },
};
defineParameterType(direction);
