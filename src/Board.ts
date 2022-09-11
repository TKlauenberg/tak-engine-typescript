import { ICloneable } from './interfaces';
import { Direction } from './Move';
import { Player } from './Player';
import { Result } from './Result';
import { Square } from './Square';
import { StoneType } from './Stone';
import { filterUndefined, range } from './util';

const stoneCounts = new Map([
  [3, { F: 10, C: 0, total: 10 }],
  [4, { F: 15, C: 0, total: 15 }],
  [5, { F: 21, C: 1, total: 22 }],
  [6, { F: 30, C: 1, total: 31 }],
  [8, { F: 50, C: 2, total: 52 }],
]);

// TODO check if eslint can trace the enum?
// eslint-disable-next-line no-unused-vars
enum Edges {
  // eslint-disable-next-line no-unused-vars
  None = 0,
  // eslint-disable-next-line no-unused-vars
  Top = 1,
  // eslint-disable-next-line no-unused-vars
  Bottom = 2,
  // eslint-disable-next-line no-unused-vars
  Left = 4,
  // eslint-disable-next-line no-unused-vars
  Right = 8,
}
const TopToBottom = Edges.Top | Edges.Bottom;
const LeftToRight = Edges.Left | Edges.Right;

type RoadSquare = Square & { edges: Edges };
export interface GameStones {
  F: number;
  C: number;
}
/**
 *
 * @param {T} maybeGameStones Object that could be a Gamestones Object
 * @return {boolean}
 */
export function isGameStones(
  maybeGameStones: unknown | GameStones,
): maybeGameStones is GameStones {
  const gameStones = maybeGameStones as GameStones;
  return typeof gameStones.F === 'number' && typeof gameStones.C === 'number';
}

/**
 * get how many stones a game of a specific size can have
 * @param {number} size size of the board
 * @return {Result<GameStones>}
 */
export function getStoneCount(size: number): Result<GameStones> {
  if (stoneCounts.has(size)) {
    return [true, stoneCounts.get(size)!];
  } else {
    return [false, new Error('size not available')];
  }
}

const startRowCharCode = 'a'.charCodeAt(0);

/**
 * Class to interact with the board
 */
export class Board extends Array<Square[]> implements ICloneable<Board> {
  /**
   * get the size of the board
   */
  public get size(): number {
    return this.length;
  }
  /**
   * get tps of the board
   */
  public get tps(): string {
    return Board.getTps(this);
  }

  /**
   * Create TPS String of the board
   * @param {Array<Array<Square>>} board board which is transformed to tps
   * @return {string}
   */
  public static getTps(board: Square[][]): string {
    const rows = [];
    for (const row of board) {
      let countEmpty = 0;
      const parts = [];
      for (const square of row) {
        if (square.stones.length === 0) {
          countEmpty++;
        } else {
          if (countEmpty > 0) {
            parts.push(`x${countEmpty}`);
          }
          const tileTps = square.stones
            .map((x) => (x.player === Player.One ? '1' : '2'))
            .reduce((x, y) => x + y, '');
          // eslint-disable-next-line max-len
          const stoneType =
            square.top.type === StoneType.FLAT ? '' : square.top.type;
          parts.push(tileTps + stoneType);
        }
      }
      if (countEmpty > 0) {
        parts.push(`x${countEmpty}`);
      }
      const rowTps = parts.join(',');
      rows.push(rowTps);
    }
    return rows.reverse().join('/');
  }

  /**
   * get roads on the current board
   */
  public get roads(): RoadSquare[][] {
    return Board.getRoads(this);
  }

  /**
   * get roads on current board (functional style)
   * @param {Array<Array<Square>>} board board information
   * @return {Array<Array<RoadSquare>>}
   */
  public static getRoads(board: Square[][]): RoadSquare[][] {
    const bottom = board[0];
    // indexes from 1 to size - 1 so we don't get tiles multiple times
    const indexes = Array.from(range(1, board.length - 1));
    const left = indexes.map((x) => board[x][0]);
    const borderTiles = bottom
      .concat(left)
      // eslint-disable-next-line max-len
      .filter((x) => x.top !== undefined && x.top.type !== StoneType.STANDING);
    return borderTiles
      .map((x) => Board.findRoadsFromTile(board, x))
      .reduce((x, y) => x.concat(y), []);
  }

  /**
   * check if all squares on the board are filled
   */
  public get isFull(): boolean {
    return Board.isBoardFull(this);
  }

  /**
   * get current score of the board
   */
  public get score(): [number, number] {
    return [Board.getScore(this, Player.One), Board.getScore(this, Player.Two)];
  }

  public static getScore(board: Square[][], player: Player): number;
  public static getScore(board: Square[][]): [number, number];
  /**
   * get the score of one or both players from the board
   * @param {Array<Array<Square>>} board board information
   * @param {Player} player undefined or the player for which to get the score
   * @return {number|[number,number]}
   */
  public static getScore(
    board: Square[][],
    player?: Player,
  ): [number, number] | number {
    if (player === undefined) {
      return [
        Board.getScore(board, Player.One),
        Board.getScore(board, Player.Two),
      ];
    } else {
      const squares = board.reduce((x, y) => x.concat(y));
      const filtered = squares
        .filter((x) => !x.isEmpty)
        .filter((x) => {
          const topIsFromPlayer = x.top.player === player;
          const topIsFlatStone = x.top.type === StoneType.FLAT;
          return topIsFromPlayer && topIsFlatStone;
        });
      return filtered.length;
    }
  }

  /**
   * Check if all squares of a board do have stones on it
   * @param {Array<Array<Square>>} board minmal info about the board
   * @return {boolean}
   */
  public static isBoardFull(board: Square[][]): boolean {
    return board.every((x) => x.every((y) => y.hasStones));
  }

  /**
   * clones a Board to not change the initial board for functional style
   * @param {Array<Array<Square>>} board the board to clone
   * @return {Array<Array<Square>>}
   */
  public static clone(board: Square[][]): Square[][] {
    const newBoard = board.map((x) => x.map((y) => y.clone()));
    return newBoard;
  }

  /**
   * get a Square by the position
   * @param {Array<Array<Square>>} board minimal info about board
   * @param {string} position positiion of the square
   * @return {Square}
   */
  public static getSquare(board: Square[][], position: string): Square {
    const [row, column] = Board.getPosition(position);
    return board[row][column];
  }

  /**
   * Get next square in one direction.
   * This function is used in a move and a stack is moved
   * @example Board.getNeighbourSquare(board, 'b2', Direction.Up, 2)
   * would give the square on position 'b4'
   * @param {Array<Array<Square>>} board minimal info about board
   * @param {string} position position of the Square from where to go from
   * @param {Direction} direction direction in which to get the next Square
   * @param {number} length how long in one direction to go
   * @return {Square}
   */
  public static getNeighbourSquare(
    board: Square[][],
    position: string,
    direction: Direction,
    length = 1,
  ): Square {
    let [row, column] = Board.getPosition(position);
    switch (direction) {
      case Direction.Down:
        row -= length;
        break;
      case Direction.Up:
        row += length;
        break;
      case Direction.Left:
        column -= length;
        break;
      case Direction.Right:
        column += length;
        break;
    }
    return board[row][column];
  }

  /**
   * Get all squares next to the the position which is given
   * used for pathfinding
   * @param {Array<Array<Square>>} board minimal information about the board
   * @param {string} position the middle position
   * from wich to get all neighbours
   * @return {Array<Square>}
   */
  public static getAllNeighbourSquares(
    board: Square[][],
    position: string,
  ): Square[] {
    const [row, column] = Board.getPosition(position);
    // eslint-disable-next-line max-len
    const up =
      board[row + 1] === undefined ? undefined : board[row + 1][column];
    // eslint-disable-next-line max-len
    const down =
      board[row - 1] === undefined ? undefined : board[row - 1][column];
    const left = board[row][column - 1];
    const right = board[row][column + 1];
    return [up, down, left, right].filter(filterUndefined);
  }

  /**
   * get number indieces from a position
   * @param {string} position a ptn position
   * @return {[number, number]}
   */
  public static getPosition(position: string): [number, number] {
    const aCharCode = 'a'.charCodeAt(0);
    const [a, b] = position.split('');
    const column = a.charCodeAt(0) - aCharCode;
    const row = Number.parseInt(b) - 1;
    return [row, column];
  }

  /**
   * check which edges a Square has
   * @param {Array<Array<Square>>}  board minimal info about the board
   * @param {string} position the position of the sqare
   * @return {Edges}
   */
  private static getEdges(board: Square[][], position: string): Edges {
    const [x, y] = Board.getPosition(position);
    let edge: Edges = Edges.None;
    if (x === 0) {
      edge += Edges.Left;
    } else if (x === board.length - 1) {
      edge += Edges.Right;
    }
    if (y === 0) {
      edge += Edges.Bottom;
    } else if (y === board.length - 1) {
      edge += Edges.Top;
    }
    return edge;
  }

  /**
   * Function to find roads.
   * This function is a recursive function for finding roads.
   * @param {Array<Array<Square>>}  board minimal info about board
   * @param {Square} square get all roads beginning at this square
   * @param {Array<RoadSquare>} road
   * all squares which are part of the current road
   * @return {Array<Array<RoadSquare>>}
   */
  private static findRoadsFromTile(
    board: Square[][],
    square: Square,
    road: RoadSquare[] = [],
  ): RoadSquare[][] {
    const edges = Board.getEdges(board, square.position);
    const roadTile = square as RoadSquare;
    roadTile.edges = edges;
    road.push(roadTile);
    const roadEdges = road.reduce((x, y) => x | y.edges, Edges.None);
    const isTopToBottom = (roadEdges & TopToBottom) === TopToBottom;
    const isLeftToRight = (roadEdges & LeftToRight) === LeftToRight;
    if (isTopToBottom || isLeftToRight) {
      return [road];
    } else {
      const neighbours = Board.getAllNeighbourSquares(board, square.position);
      const positions = road.map((x) => x.position);
      const roads = neighbours
        // filter empty tiles
        .filter((x) => x.top !== undefined)
        // only flat or capstones
        // eslint-disable-next-line max-len
        .filter(
          (x) => x.top.type === StoneType.FLAT || x.top.type === StoneType.CAP,
        )
        // road must be from the same player
        .filter((x) => x.top.player === square.top.player)
        // filter tiles which were already part of the road to mitigate circles
        .filter((x) => positions.every((y) => x.position !== y))
        .map((x) => Board.findRoadsFromTile(board, x, road))
        .reduce((x, y) => x.concat(y), []);
      return roads;
    }
  }
  /**
   * board can be created empty with a specific size
   * or with a pre initialized board
   * @param {number} size size of the board
   * @param {Array<Array<Square>>} board pre initialized board
   */
  constructor(size: number, board?: Square[][]) {
    if (board === undefined) {
      super(size);
      for (let i = 0; i < this.size; i++) {
        const row = new Array<Square>(size);
        const rowIndex = String.fromCharCode(startRowCharCode + i);
        this[i] = row;
        for (let j = 0; j < row.length; j++) {
          const column = new Square(`${rowIndex}${j + 1}`, size);
          row[j] = column;
        }
      }
    } else {
      super(...board);
    }
  }

  /**
   * clone this object and return a copy
   * @return {Board}
   */
  public clone(): Board {
    const newBoard = Board.clone(this);
    return new Board(this.size, newBoard);
  }

  /**
   * get a square of the position
   * @param {string} position ptn representation of the position
   * @return {Square}
   */
  public getSquare(position: string): Square {
    return Board.getSquare(this, position);
  }

  /**
   * Get next square in one direction.
   * This function is used in a move and a stack is moved
   * @example Board.getNeighbourSquare(board, 'b2', Direction.Up, 2)
   * would give the square on position 'b4'
   * @param {string} position position of the Square from where to go from
   * @param {Direction} direction direction in which to get the next Square
   * @param {number} length how long in one direction to go
   * @return {Square}
   */
  public getNeighbourSquare(
    position: string,
    direction: Direction,
    length = 1,
  ): Square {
    return Board.getNeighbourSquare(this, position, direction, length);
  }

  /**
   * Get all squares next to the the position which is given
   * used for pathfinding
   * @param {string} position the middle position
   * from wich to get all neighbours
   * @return {Array<Square>}
   */
  public getAllNeighbourSquares(position: string): Square[] {
    return Board.getAllNeighbourSquares(this, position);
  }
}
