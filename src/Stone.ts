import { Result } from './interfaces';
import { Player } from './Player';

export enum StoneType {
    FLAT = 'F',
    STANDING = 'S',
    CAP = 'C',
}

/**
 *
 * @param {string} stoneType string representation of the stone
 * @return {Result<StoneType>}
 */
export function parseStoneType(stoneType: string): Result<StoneType> {
  switch (stoneType) {
    case 'F': return [true, StoneType.FLAT];
    case 'S': return [true, StoneType.STANDING];
    case 'C': return [true, StoneType.CAP];
    default: return [
      false,
      // eslint-disable-next-line max-len
      new Error(`Cannot parse Stone ${stoneType}. Possible StoneTypes are "F, S and C"`),
    ];
  }
}

export interface Stone {
    type: StoneType;
    player: Player;
    movable: boolean;
    position: {
        square: string;
        stack: number;
    };
}
