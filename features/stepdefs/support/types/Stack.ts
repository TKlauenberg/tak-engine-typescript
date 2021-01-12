import { defineParameterType, Transform } from 'cucumber';
import { Player, StoneType } from '../../../../lib';

const stack: Transform = {
  name: 'stack',
  // eslint-disable-next-line max-len
  regexp: /[12]*/,
  transformer: (x: string) => {
    return x.split('').map((x) => {
      const player = Number.parseInt(x);
      return {
        type: StoneType.FLAT,
        player: player === 1 ? Player.One : Player.Two,
      };
    });
  },
};
defineParameterType(stack);
