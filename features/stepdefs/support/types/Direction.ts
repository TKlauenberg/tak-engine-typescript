import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { Direction } from '../../../../lib';

const direction: IParameterTypeDefinition<Direction> = {
  name: 'direction',
  // eslint-disable-next-line max-len
  regexp: /((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/,
  transformer: (x: string): Direction => {
    // eslint-disable-next-line max-len
    const match = /((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/.exec(
      x,
    )!;
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
