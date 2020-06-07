import { Ability, UsesAbilities } from '@serenity-js/core';
import {
  Action,
  Board,
  Game,
  GameOptions,
  parsePTN,
  Player,
  PlayerInfo,
  Square,
  Stone,
  GameResult,
} from '../../../../../lib';

/**
 * Domain class in order to interact with the tak-engine
 */
export class PlayTheGame implements Ability {
  /**
   *
   * @param {UsesAbilities} actor serenity actor
   * @return {PlayTheGame}
   */
  static as(actor: UsesAbilities): PlayTheGame {
    return actor.abilityTo(PlayTheGame);
  }
  #game?: Game;
  #error?: Error;
  #result?: boolean;
  /**
   * Create Game Instance from ptn
   * @param {string} ptn ptn string
   * @return {Promise<void>}
   */
  fromPtn(ptn: string): Promise<void> {
    let gameOrError;
    [this.#result, gameOrError] = parsePTN(ptn);
    if (this.#result) {
      this.#game = gameOrError as Game;
    } else {
      this.#error = gameOrError as Error;
    }
    return new Promise((res) => res());
  }
  /**
   * @return {Promise<boolean>}
   */
  getResult(): Promise<boolean> {
    return new Promise((res) => res(this.#result));
  }
  /**
   * @return {Promsie<string>}
   */
  getTps(): Promise<string> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game?.tps));
  }
  /**
   * Create Game Instance from options
   * @param {GameOptions} options gameoptions
   */
  fromOptions(options: GameOptions): void {
    this.#game = new Game(options);
  }
  /**
   * Execute an action onto the game
   * @param {Action} action Action to execute
   * @return {Promise<void>}
   */
  execute(action: Action): Promise<void> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res, rej) => {
      try {
        this.#game?.execute(action);
        res();
      } catch (err) {
        rej(err);
      }
    });
  }
  /**
   * Execute an action onto the game
   * @param {Action} action Action to execute
   * @return {Promise<void>}
   */
  tryExecute(action: Action): Promise<void> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    try {
      this.#game?.execute(action);
    } catch (err) {
      this.#error = err as Error;
    }
    return new Promise((res) => res());
  }
  /**
   *
   * @param {string} pos position for the stack
   * @return {Square}
   */
  squareOnPosition(pos: string): Promise<Square> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.board.getSquare(pos)));
  }
  /**
   *
   * @param {string} pos position for the stack
   * @return {Stone[]}
   */
  async stackOnPosition(pos: string): Promise<Stone[]> {
    return (await this.squareOnPosition(pos)).stones;
  }
  /**
   * @return {Promise<Player>}
   */
  nextPlayer(): Promise<Player> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.currentPlayer.player));
  }
  /**
   * @return {Promise<number>}
   */
  currentRound(): Promise<number> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.moveCount));
  }
  /**
   * @return {Promise<number>}
   */
  getSize(): Promise<number> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.size));
  }
  /**
   * @return {Promise<Board>}
   */
  getBoard(): Promise<Board> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.board));
  }
  /**
   * @return {Promise<Error>}
   */
  lastError(): Promise<Error> {
    return new Promise((res) => res(this.#error));
  }
  /**
   *
   * @param {Player} player
   * @return {Promise<PlayerInfo>}
   */
  getPlayerInfo(player: Player): Promise<PlayerInfo> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    const playerInfo =
      player === Player.One ? this.#game?.player1 : this.#game?.player2;
    return new Promise((res) => res(playerInfo));
  }
  /**
   * @return {Promise<boolean>}
   */
  hasEnded(): Promise<boolean> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.hasEnded));
  }
  /**
   * @return {Promise<GameResult>}
   */
  gameResult(): Promise<GameResult> {
    if (this.#game === undefined) {
      throw new Error('game not initialized');
    }
    return new Promise((res) => res(this.#game!.result));
  }
}
