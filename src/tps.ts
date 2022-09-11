import { Board } from './Board';
import { ParsingError } from './Errors';
import { grammar } from './grammar';
import { Result } from './interfaces';
import { Player, PlayerInfo } from './Player';
import { Square } from './Square';
import { parseStoneType, Stone, StoneType } from './Stone';

export interface TPS {
  board: Square[][];
  player: Player;
  move: number;
}
const startColumnCharCode = 'a'.charCodeAt(0);
/**
 * parse only the board from the tps
 * @param {string} tpsPart tps string of the board
 * @param {number} boardSize configured board size
 * @param {PlayerInfo} player1 object of player one
 * @param {PlayerInfo} player2 object of player two
 * @return {Result<Board>} Board object of tps
 */
function parseBoard(
    tpsPart: string,
    boardSize: number,
    player1: PlayerInfo,
    player2: PlayerInfo,
): Result<Square[][]> {
  let rest = tpsPart;
  // rows will be added top to bottom because tps starts at top row
  const board: Square[][] = [];
  let currentRow = boardSize;
  let currentPosition = startColumnCharCode;
  board.unshift([]);
  while (rest !== '') {
    const part = grammar.colGrouped.exec(rest)!;
    rest = rest.slice(part[0].length);
    if (part) {
      if (part[1] !== undefined && part[1] !== '') {
        // empty squares
        // parse second char to int for the amount of empty squares
        const countSquares = Number.parseInt(part[1][1]);
        for (let i = 0; i < countSquares; i++) {
          // use zero index cause the we always add a new first line
          board[0].push(
              new Square(
                  `${String.fromCharCode(currentPosition)}${currentRow}`,
                  boardSize,
              ),
          );
          currentPosition++;
        }
      }
      if (part[2]) {
        // stones on square
        let stack = part[2];
        let topStoneType = StoneType.FLAT;
        const position = `${String.fromCharCode(currentPosition)}${currentRow}`;
        if (isNaN(parseInt(stack[stack.length - 1]))) {
          const [parseResult, stone] = parseStoneType(stack[stack.length - 1]);
          if (parseResult) {
            topStoneType = stone as StoneType;
          } else {
            return [false, stone as Error];
          }
          stack = stack.slice(0, -1);
        }
        const stones: Stone[] = [];
        for (let i = 0; i < stack.length; i++) {
          // get current number
          const playerNumber = parseInt(stack.slice(i, i + 1));
          // the regex above already has checked if only number 1 and 2 are used
          const player = playerNumber === 1 ? player1 : player2;
          const stone = player.getStone(StoneType.FLAT);
          if (stone === undefined) {
            return [
              false,
              new Error('Not enough stones for this board. Could not use TPS'),
            ];
          }
          stones.push(stone);
        }
        stones[stones.length - 1].type = topStoneType;
        board[0].push(new Square(position, boardSize, ...stones));
      }
      if (part[1] === '' && part[2] === '') {
        return [false, new Error('could not parse tps')];
      }
      if (part[3] === '/') {
        board.unshift([]);
        currentPosition = startColumnCharCode;
        currentRow--;
      } else {
        currentPosition++;
      }
    } else {
      return [false, new Error('could not parse tps')];
    }
  }
  // check for wrong size
  if (board.length !== boardSize || board.some((x) => x.length !== boardSize)) {
    return [false, new Error(`wrong board size on one line`)];
  }
  return [true, new Board(boardSize, board)];
}

/**
 * parse TPS Tag
 * @param {string} tpsString tps tag
 * @param {number} boardSize size of the board
 * @param {PlayerInfo} player1 object of player one
 * @param {PlayerInfo} player2 object of player two
 * @return {TPS} information of the board, next player and the movecount
 */
export function parse(
    tpsString: string,
    boardSize: number,
    player1: PlayerInfo,
    player2: PlayerInfo,
): Result<TPS> {
  const parts = grammar.tpsGrouped.exec(tpsString)!;
  if (!parts[1]) {
    return [false, new ParsingError(`TPS didn't match grammar`, 'TPS', '')];
  } else {
    if (parts[3] === '') {
      return [false, new Error('Missing next Player from TPS')];
    }
    if (parts[5] === '') {
      return [false, new Error('Missing next Movecount from TPS')];
    }
    const [boardResult, board] = parseBoard(
        parts[1],
        boardSize,
        player1,
        player2,
    );
    if (boardResult) {
      const tps: TPS = {
        board: board as Board,
        player: parseInt(parts[3]) === 1 ? Player.One : Player.Two,
        move: parseInt(parts[5]),
      };
      return [true, tps];
    } else {
      return [false, board as Error];
    }
  }
}
