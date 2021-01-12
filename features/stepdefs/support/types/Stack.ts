import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { Player, Stone, StoneType } from '../../../../lib';

const stack: IParameterTypeDefinition<Stone[]> = {
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
