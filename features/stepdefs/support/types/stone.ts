import { defineParameterType, Transform } from 'cucumber';
import { StoneType } from '../../../../lib';
import { getPlayerByColor } from './Player';

const stone: Transform = {
  name: 'stone',
  // eslint-disable-next-line max-len
  regexp: /(?:(?:(?:flat)|(?:standing)) (?:(?:black)|(?:white)) stone)|(?:(?:(?:black)|(?:white)) capstone)/,
  transformer: (x) => {
    // eslint-disable-next-line max-len
    const match = /(((?:flat)|(?:standing)) ((?:black)|(?:white)) stone)|(((?:black)|(?:white)) capstone)/.exec(
      x,
    )!;
    // is a stone (not a capstone)
    if (match[1]) {
      // color is in group 3 if we don't have a cap stone
      const color = match[3];
      if (match[2] === 'standing') {
        return {
          type: StoneType.STANDING,
          player: getPlayerByColor(color),
        };
      } else {
        return {
          type: StoneType.FLAT,
          player: getPlayerByColor(color),
        };
      }
    } else {
      const color = match[5];
      return {
        type: StoneType.CAP,
        player: getPlayerByColor(color),
      };
    }
  },
};
defineParameterType(stone);
