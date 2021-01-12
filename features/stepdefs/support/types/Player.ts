import { defineParameterType, Transform } from 'cucumber';
import { Player } from '../../../../lib/Player';

/**
 * transform color to Player enum
 * @param {string} color color of the player
 * @return {Player}
 */
export function getPlayerByColor(color: string): Player {
  return color === 'white' ? Player.One : Player.Two;
}

/**
 * transform number to Player enum
 * @param {number | string} playerNumber number of the player
 * @return {Player}
 */
export function getPlayerByNumber(playerNumber: number | string): Player {
  // eslint-disable-next-line max-len
  const x =
    typeof playerNumber === 'string' ? parseInt(playerNumber) : playerNumber;
  switch (x) {
    case 1:
      return Player.One;
    case 2:
      return Player.Two;
    default:
      throw new Error(`there is no player ${x}`);
  }
}
const playerColor: Transform = {
  name: 'playerByColor',
  regexp: /(black)|(white)/,
  transformer: getPlayerByColor,
};
defineParameterType(playerColor);

const player: Transform = {
  name: 'player',
  regexp: /[pP]layer [12]/,
  transformer: (x: string) => {
    const playerNumber = /[pP]layer ([12])/.exec(x)![1];
    return getPlayerByNumber(playerNumber);
  },
};
defineParameterType(player);
