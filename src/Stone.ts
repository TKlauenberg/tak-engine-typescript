import { Result } from './interfaces';
import { Player, colorFromPlayer } from './Player';

export enum StoneType {
  FLAT = 'F',
  STANDING = 'S',
  CAP = 'C',
}

/**
 *
 * @param {StoneType} stoneType
 * @return {string}
 */
export function textOfStoneType(stoneType: StoneType): string {
  switch (stoneType) {
    case StoneType.FLAT:
      return 'flat stone';
    case StoneType.STANDING:
      return 'standing stone';
    case StoneType.CAP:
      return 'capstone';
  }
}

/**
 *
 * @param {string} stoneType string representation of the stone
 * @return {Result<StoneType>}
 */
export function parseStoneType(stoneType: string): Result<StoneType> {
  switch (stoneType) {
    case 'F':
      return [true, StoneType.FLAT];
    case 'S':
      return [true, StoneType.STANDING];
    case 'C':
      return [true, StoneType.CAP];
    default:
      return [
        false,
        // eslint-disable-next-line max-len
        new Error(
          `Cannot parse Stone ${stoneType}. Possible StoneTypes are "F, S and C"`,
        ),
      ];
  }
}

/**
 * basic stone class
 */
export class Stone {
  public type: StoneType;
  public player: Player;
  /**
   *
   * @param {StoneType} type type of the stone
   * @param {Player} player player of the stone
   */
  constructor(type: StoneType, player: Player) {
    this.type = type;
    this.player = player;
  }
  /**
   * string representation of the stone
   * @return {string}
   */
  toString(): string {
    const color = colorFromPlayer(this.player);
    const stone = textOfStoneType(this.type);
    return `${color} ${stone}`;
  }
}
