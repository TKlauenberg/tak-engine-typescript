import { ICloneable } from './interfaces';
import { Stone, StoneType } from './Stone';

export enum Edge {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

/**
 * Information of a single square on the board
 */
export class Square implements ICloneable<Square> {
  position: string;
  stones: Stone[];
  #boardSize: number;

  /**
   *
   * @param {string} position position of the square
   * @param {number} boardSize
   * @param {Stone[]} stones stones which are on the square
   */
  public constructor(position: string, boardSize: number, ...stones: Stone[]) {
    this.position = position;
    this.stones = stones;
    this.#boardSize = boardSize;
  }

  /**
   *
   * @param {Stone[]} tile array of stones
   * @return {Stone}
   */
  public static getTop(tile: Stone[]): Stone {
    return tile[tile.length - 1];
  }

  /**
   *
   * @param {Stone[]} tile array of stones
   * @return {boolean}
   */
  public static isEmpty(tile: Stone[]): boolean {
    return tile.length === 0;
  }

  /**
   * Test if stones can be dropped on square
   * @param {Stone[]} tile tile which is tested
   * @param {Stone[]} stones stones which are tested to drop
   * @return {[true] | [false, Error] }
   */
  public static canDropStones(
    tile: Stone[],
    ...stones: Stone[]
  ): [true] | [false, Error] {
    if (tile.length === 0) {
      return [true];
    }
    switch (Square.getTop(tile).type) {
      case StoneType.FLAT:
        return [true];
      case StoneType.STANDING:
        if (stones.length === 1) {
          if (stones[0].type === StoneType.CAP) {
            return [true];
          } else {
            return [
              false,
              new Error('Can only flatten a wall with a capstone'),
            ];
          }
        } else {
          return [
            false,
            new Error('Can only flatten a wall with one capstone'),
          ];
        }
      case StoneType.CAP:
        return [false, new Error('Cannot move a stone onto a capstone')];
      default:
        return [false, new Error('Top tile is not a stone')];
    }
  }

  /**
   * Drop new stones on tile
   * @param {string} position position of the drop for UI information
   * @param {number} boardSize size of the board
   * @param {Stone[]} square minimal information of the square
   * @param {Stone[]} stones stones to be dropped
   * @return {Stone[]} new Tile stones
   */
  public static drop(
    position: string,
    boardSize: number,
    square: Stone[],
    ...stones: Stone[]
  ): Stone[] {
    const [canDrop, reason] = Square.canDropStones(square, ...stones);
    if (canDrop) {
      if (
        !Square.isEmpty(square) &&
        Square.getTop(square).type === StoneType.STANDING
      ) {
        // flattening wall
        Square.getTop(square).type = StoneType.FLAT;
      }
      const resultStack = [...square, ...stones];
      return resultStack;
    } else {
      throw reason;
    }
  }

  /**
   * take stones from square
   * @param {Stone[]} square minimal information of square
   * @param {number} count amount of stones to take
   * @return {Stone[]}
   */
  public static take(square: Stone[], count: number): Stone[] {
    if (count > square.length) {
      // eslint-disable-next-line max-len
      throw new Error(
        `There are ${square.length} stones on this square. Cannot move ${count} stones`,
      );
    } else {
      const stones: Stone[] = [];
      for (let i = 0; i < count; i++) {
        stones.unshift(square.pop()!);
      }
      return stones;
    }
  }

  /**
   * @return {Stone}
   */
  public get top(): Stone {
    return Square.getTop(this.stones);
  }

  /**
   * @return {boolean}
   */
  public get isEmpty(): boolean {
    return this.stones.length === 0;
  }

  /**
   * @return {boolean}
   */
  public get hasStones(): boolean {
    return this.stones.length > 0;
  }

  /**
   * @return {Stone[]}
   */
  public getStones(): Stone[] {
    return this.stones;
  }

  /**
   * Test if stones can be dropped on square
   * @param {Stone[]} stones stones which are tested
   * @return {[true] | [false, Error]}
   */
  public canDrop(...stones: Stone[]): [true] | [false, Error] {
    return Square.canDropStones(this.stones, ...stones);
  }

  /**
   * Drop new stones on square
   * @param {Stone[]} stones stones to be dropped
   */
  public drop(...stones: Stone[]): void {
    // eslint-disable-next-line max-len
    this.stones = Square.drop(
      this.position,
      this.#boardSize,
      this.stones,
      ...stones,
    );
  }

  /**
   * take stones from square
   * @param {number} count amount of stones to take
   * @return {Stone[]}
   */
  public take(count: number): Stone[] {
    return Square.take(this.stones, count);
  }

  /**
   * @return {Square}
   */
  public clone(): Square {
    return new Square(this.position, this.#boardSize, ...this.stones);
  }
}
