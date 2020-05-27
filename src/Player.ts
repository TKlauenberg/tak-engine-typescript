import { GameStones, isGameStones } from './Board';
import { Stone, StoneType } from './Stone';

export enum Player {
  One = 1,
  Two = 2,
}
export interface StoneBag {
  F: Stone[];
  C: Stone[];
}

export interface IPlayerInfo {
  name: string;
  player: Player;
}

/**
 * All information of a player
 */
export class PlayerInfo {
  /**
   *
   * @param {StoneBag | PlayerInfo} stoneInfo Information about Stones
   * @return {number}
   */
  public static getTotalStones(stoneInfo: StoneBag | PlayerInfo): number {
    // used for functional style
    if (stoneInfo instanceof PlayerInfo) {
      return stoneInfo.total;
    } else {
      return stoneInfo.F.length + stoneInfo.C.length;
    }
  }

  /**
   *
   * @param {StoneBag | PlayerInfo} stoneInfo Information about Stones
   * @return {number}
   */
  public static getNormalStonesCount(stoneInfo: StoneBag | PlayerInfo): number {
    if (stoneInfo instanceof PlayerInfo) {
      return stoneInfo.normalStonesCount;
    } else {
      return stoneInfo.F.length;
    }
  }

  /**
 *
 * @param {StoneBag | PlayerInfo} stoneInfo Information about Stones
 * @return {number}
 */
  public static getCapstonesCount(stoneInfo: StoneBag | PlayerInfo): number {
    if (stoneInfo instanceof PlayerInfo) {
      return stoneInfo.normalStonesCount;
    } else {
      return stoneInfo.C.length;
    }
  }

  /**
 *
 * @param {StoneBag} stoneBag Information about Stones
 * @param {StoneType} stoneType type of the stone
 * @return {boolean}
 */
  public static hasStone(stoneBag: StoneBag, stoneType: StoneType): boolean {
    if (stoneType === StoneType.CAP) {
      return this.getCapstonesCount(stoneBag) > 0;
    } else {
      return this.getNormalStonesCount(stoneBag) > 0;
    }
  }

  /**
   *
   * @param {StoneBag} stoneBag Stonebag to get the Stone
   * @param {StoneType} type type of the stone to get
   * @return {Stone | undefined}
   */
  public static getStone(
      stoneBag: StoneBag,
      type: StoneType
  ): Stone | undefined {
    let stone = undefined;
    switch (type) {
      case StoneType.CAP:
        stone = stoneBag.C.pop();
        break;
      case StoneType.FLAT:
        stone = stoneBag.F.pop();
        break;
      case StoneType.STANDING:
        stone = stoneBag.F.pop();
        if (stone !== undefined) {
          stone.type = StoneType.STANDING;
        }
        break;
      default:
        break;
    }
    return stone;
  }

  /**
   *
   * @param {GameStones} stones count of the stones to generate
   * @param {Player} player player wich has the stonebag
   * @return {StoneBag}
   */
  public static createStoneBag(stones: GameStones, player: Player): StoneBag {
    const flats: Stone[] = Array(stones.F)
        .fill(1)
        .map((_, index) => ({
          type: StoneType.FLAT,
          player, movable: true,
          position: {
            square: '',
            stack: index,
          },
        }));
    const cap: Stone[] = Array(stones.C)
        .fill(1)
        .map((_, index) => ({
          type: StoneType.CAP,
          player,
          movable: true,
          position: {
            square: '',
            stack: index + flats.length,
          },
        }));
    const stoneBag = { C: cap, F: flats };
    return stoneBag;
  }
  public name: string;

  /**
   * @return {number}
   */
  get total(): number {
    return PlayerInfo.getTotalStones(this.stoneBag);
  }

  /**
   * @return {number}
   */
  get normalStonesCount(): number {
    return PlayerInfo.getNormalStonesCount(this.stoneBag);
  }

  /**
   * @return {number}
   */
  get capstonesCount(): number {
    return PlayerInfo.getCapstonesCount(this.stoneBag);
  }
  public player: Player;
  private stoneBag: StoneBag;
  /**
   *
   * @param {string} name name of the player
   * @param {Player} player PlayerInfo object for the player
   * @param {GameStones | StoneBag} gameStones StoneBag for the Player
   */
  constructor(name: string, player: Player, gameStones: GameStones | StoneBag) {
    this.name = name;
    this.player = player;
    if (isGameStones(gameStones)) {
      this.stoneBag = PlayerInfo.createStoneBag(gameStones, player);
    } else {
      this.stoneBag = gameStones;
    }
  }

  /**
   *
   * @param {StoneType} stoneType stone to look for
   * @return {boolean}
   */
  public hasStone(stoneType: StoneType): boolean {
    if (stoneType === StoneType.CAP) {
      return this.capstonesCount > 0;
    } else {
      return this.normalStonesCount > 0;
    }
  }

  /**
   *
   * @param {StoneType} type stoneType to get
   * @return {Stone | undefined}
   */
  public getStone(type: StoneType): Stone | undefined {
    return PlayerInfo.getStone(this.stoneBag, type);
  }
}
