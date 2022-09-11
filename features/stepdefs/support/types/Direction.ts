import { defineParameterType } from '@cucumber/cucumber';
import { Direction } from '../../../../lib';

defineParameterType({
  name: 'direction',
  // eslint-disable-next-line max-len
  regexp:
    /((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/,
  transformer: (up: string, down: string, right: string): Direction => {
    if (up !== undefined) {
      return Direction.Up;
    } else if (down !== undefined) {
      return Direction.Down;
    } else if (right !== undefined) {
      return Direction.Right;
    } else {
      return Direction.Left;
    }
  },
});
