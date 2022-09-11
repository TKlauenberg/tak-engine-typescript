import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { Direction } from '../../../../lib';

const direction: IParameterTypeDefinition<Direction> = {
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
};
defineParameterType(direction);
