import { GameResult } from '.';
import { Board, getStoneCount } from './Board';
import { Action, excecuteMove } from './Move';
import { Player, PlayerInfo, StoneBag } from './Player';
import { Square } from './Square';
import { parse as parseTps, TPS } from './tps';

export interface GameOptions {
  size: number;
  player1?: string;
  player2?: string;
  tps?: string;
}

/**
 * Base Object for handling a game
 */
export class Game {
  /**
   * Checks if game has ended
   * @param {Array<Array<Square>>} board board to check
   * @param {Player} currentPlayer current player
   * @param {StoneBag} player1 info of player1
   * @param {StoneBag} player2 info of player2
   * @return {GameResult | false}
   */
  public static hasGameEnded(
    board: Square[][],
    currentPlayer: Player,
    player1: StoneBag | PlayerInfo,
    player2: StoneBag | PlayerInfo,
  ): GameResult | false {
    const roads = Board.getRoads(board);
    // road win
    if (roads.length > 0) {
      let winningPlayer = Player.One;
      if (roads.length === 1) {
        winningPlayer = roads[0][0].top.player;
      } else {
        const couldPlayerOneWin = roads.some(
          (x) => x[0].top.player === Player.One,
        );
        const couldPlayerTwoWin = roads.some(
          (x) => x[0].top.player === Player.Two,
        );
        if (couldPlayerOneWin && couldPlayerTwoWin) {
          winningPlayer = currentPlayer;
        } else if (couldPlayerOneWin) {
          winningPlayer = Player.One;
        } else {
          winningPlayer = Player.Two;
        }
      }
      return winningPlayer === Player.One ? 'R-0' : '0-R';
    }
    // count win
    if (
      Board.isBoardFull(board) ||
      PlayerInfo.getTotalStones(player1) === 0 ||
      PlayerInfo.getTotalStones(player2) === 0
    ) {
      const [scorePlayer1, scorePlayer2] = Board.getScore(board);
      if (scorePlayer1 === scorePlayer2) {
        return '1/2-1/2';
      } else if (scorePlayer1 > scorePlayer2) {
        return 'F-0';
      } else {
        return '0-F';
      }
    }
    return false;
  }

  /**
   * get TPS string of the current state (functional style)
   * @param {Array<Array<Square>>} board
   * @param {Player} currentPlayer current player
   * @param {number} moveCount
   * @return {string}
   */
  public static getTps(
    board: Square[][],
    currentPlayer: Player,
    moveCount: number,
  ): string {
    const player = currentPlayer === Player.One ? '1' : '2';
    return `${Board.getTps(board)} ${player} ${moveCount}`;
  }

  /**
   * execute a move on the board (functional style)
   * @param {Array<Array<Square>>} board
   * @param {Player} currentPlayer current player
   * @param {number} moveCount
   * @param {Action} move move to execute
   * @param {StoneBag} player1 info of player1
   * @param {StoneBag} player2 info of player2
   * @return {Array<Array<Square>>}
   */
  public static executeMove(
    board: Square[][],
    currentPlayer: Player,
    moveCount: number,
    move: Action,
    player1: PlayerInfo | StoneBag,
    player2: PlayerInfo | StoneBag,
  ): Array<Array<Square>> {
    // first action is always a place of an enemy stone
    // move.action is checked cause of typescript type checking
    let player = currentPlayer;
    if (moveCount === 1) {
      player = currentPlayer === Player.One ? Player.Two : Player.One;
    }
    const stoneBagOrPlayerInfo = player === Player.One ? player1 : player2;
    // eslint-disable-next-line max-len
    const playerInfo =
      stoneBagOrPlayerInfo instanceof PlayerInfo
        ? stoneBagOrPlayerInfo
        : new PlayerInfo('', player, stoneBagOrPlayerInfo);
    // eslint-disable-next-line max-len
    const [couldExcecute, newBoardOrError] = excecuteMove(
      move,
      board,
      playerInfo,
    );
    if (couldExcecute) {
      return newBoardOrError as Board;
    } else {
      throw newBoardOrError;
    }
  }
  public player1: PlayerInfo;
  public player2: PlayerInfo;
  public size: number;
  public result?: GameResult;
  public board: Board;
  public moveCount: number;
  public currentPlayer: PlayerInfo;
  /**
   * create a game
   * @param {GameOptions} options options for the Game
   */
  constructor(options: GameOptions) {
    const [isBoardSizeValid, stoneBagOrError] = getStoneCount(options.size);
    if (!isBoardSizeValid) {
      throw new Error(`Bord Size is not valid! Bord size is ${options.size}`);
    }
    this.size = options.size;
    const gameStones = stoneBagOrError;
    const player1Name = options.player1 || 'white';
    this.player1 = new PlayerInfo(player1Name, Player.One, gameStones);
    const player2Name = options.player2 || 'black';
    this.player2 = new PlayerInfo(player2Name, Player.Two, gameStones);
    if (options.tps !== undefined) {
      const [tpsParseResult, tpsOrError] = parseTps(
        options.tps,
        this.size,
        this.player1,
        this.player2,
      );
      // eslint-disable-next-line max-len, @typescript-eslint/no-unused-vars
      const resultIsTps = (
        result: boolean,
        tpsOrError: TPS | Error,
      ): tpsOrError is TPS => result;
      // use function as type guard
      if (resultIsTps(tpsParseResult, tpsOrError)) {
        const tps = tpsOrError;
        this.board = new Board(this.size, tps.board);
        this.moveCount = tps.move;
        // eslint-disable-next-line max-len
        this.currentPlayer =
          tps.player === Player.One ? this.player1 : this.player2;
      } else {
        throw tpsOrError;
      }
    } else {
      // standard options
      this.moveCount = 1;
      this.board = new Board(this.size);
      this.currentPlayer = this.player1;
    }
  }

  /**
   * Check if Game has ended
   * @return {boolean}
   */
  get hasEnded(): boolean {
    if (this.result === undefined) {
      const result = Game.hasGameEnded(
        this.board,
        this.currentPlayer.player,
        this.player1,
        this.player2,
      );
      if (result !== false) {
        this.result = result;
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * @return {string}
   */
  public get tps(): string {
    return Game.getTps(this.board, this.currentPlayer.player, this.moveCount);
  }

  /**
   *
   * @param {Action} move move to be executed
   * @return {ThisType}
   */
  public execute(move: Action): this {
    // first action is always a place of an enemy stone
    // move.action is checked cause of typescript type checking
    let player = this.currentPlayer;
    if (this.moveCount === 1) {
      // eslint-disable-next-line max-len
      player =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
    const [couldExcecute, newBoardOrError] = excecuteMove(
      move,
      this.board,
      player,
    );
    if (couldExcecute) {
      if (!this.hasEnded) {
        if (this.currentPlayer === this.player1) {
          this.currentPlayer = this.player2;
        } else {
          this.currentPlayer = this.player1;
          this.moveCount++;
        }
      }
      this.board = newBoardOrError;
      return this;
    } else {
      throw newBoardOrError;
    }
  }
}
