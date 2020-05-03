import { Board } from './Board';
import { grammar } from './grammar';
import { Result } from './interfaces';
import { PlayerInfo } from './Player';
import { Square } from './Square';
import { Stone, StoneType } from './Stone';

export enum MoveType {
  Place = 'Place',
  Move = 'Move',
}
export enum Direction {
  Up = '+',
  Down = '-',
  Left = '<',
  Right = '>',
}
export interface Place {
  action: MoveType.Place;
  position: string;
  stoneType: StoneType;
}
export interface Move {
  action: MoveType.Move;
  position: string;
  amount: number;
  direction: Direction;
  drops: number[];
}

/**
 *
 * @param {string} direction ptn string for direction
 * @return {Direction}
 */
function parseDirection(direction: string) {
  switch (direction) {
    case '+':
      return Direction.Up;
    case '-':
      return Direction.Down;
    case '<':
      return Direction.Left;
    case '>':
      return Direction.Right;
    default:
      throw new Error(`cannot parse Direction "${direction}"`);
  }
}

export type Action = Place | Move;

/**
 *
 * @param {string} ptnMove ptn string of the move
 * @return {Result<Action>}
 */
export function parse(ptnMove: string): Result<Action> {
  const type = grammar.plyGrouped.exec(ptnMove)!;
  if (type[2]) {
    // Move
    const action = MoveType.Move;
    const parts = grammar.slideGrouped.exec(type[2])!;
    const amount = Number.parseInt(parts[1]) || 1;
    const position = parts[2];
    const direction = parseDirection(parts[3]);
    // eslint-disable-next-line max-len
    const drops = parts[4] === '' ? [amount] : Array.from(parts[4]).map((x) => Number.parseInt(x));
    const move: Action = {
      action,
      amount,
      position,
      direction,
      drops,
    };
    return [true, move];
  } else if (type[3]) {
    // Place
    const action = MoveType.Place;
    const parts = grammar.placeGrouped.exec(type[3])!;
    const stoneType: StoneType = (parts[1] as StoneType) || StoneType.FLAT;
    const position = parts[2];
    const move: Action = {
      action,
      stoneType,
      position,
    };
    return [true, move];
  }
  return [false, new Error(`move could not be parsed! move: ${ptnMove}`)];
}

/**
 *
 * @param {Action} action Action to serialize
 * @return {string}
 */
export function serialize(action: Action) {
  if (action.action === MoveType.Place) {
    // eslint-disable-next-line max-len
    const typeString = action.stoneType === StoneType.FLAT ? '' : action.stoneType;
    return `${typeString}${action.position}`;
  } else {
    // eslint-disable-next-line max-len
    return `${action.amount}${action.position}${action.direction}${action.drops.join('')}`;
  }
}

/**
 *
 * @param {Action} move move to execute
 * @param {T} board board where to execute the move
 * @param {PlayerInfo} player player wich executes the move
 * @return {Result<T>}
 */
export function excecuteMove<T extends Square[][]>(
    move: Action,
    board: T,
    player: PlayerInfo
): Result<T> {
  if (move.action === MoveType.Place) {
    const stone = player.getStone(move.stoneType);
    if (stone !== undefined) {
      const square = Board.getSquare(board, move.position);
      if (square.stones.length > 0) {
        return [false, new Error('Cannot place a stone on a non empty board')];
      } else {
        square.drop(stone);
      }
    } else {
      return [false, new Error('Player has not enough stones')];
    }
  } else {
    const square = Board.getSquare(board, move.position);
    let stones: Stone[];
    try {
      stones = square.take(move.amount);
    } catch (err) {
      return [false, err];
    }
    for (let i = 0; i < move.drops.length; i++) {
      const dropSquare =
        Board.getNeighbourSquare(board, move.position, move.direction, i + 1);
      if (dropSquare === undefined) {
        return [false, new Error('Cannot move out of the board')];
      }
      const dropStones: Stone[] = [];
      for (let x = 0; x < move.drops[i]; x++) {
        const stone = stones.shift();
        // no check needed for undefined
        // because otherwithe the square.take method throws an error
        dropStones.push(stone!);
      }
      if (dropSquare.canDrop(...dropStones)) {
        dropSquare.drop(...dropStones);
      } else {
        return [false, new Error(`Cannot drop stones on ${move.position}`)];
      }
    }
  }
  return [true, board];
}

// todo create validate function
// validation with error in execute function?
