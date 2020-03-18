import { GameStones } from "./Board";
import { Stone, StoneType } from "./Stone";

export enum Player {
    One = 1,
    Two = 2,
}
export interface StoneBag {
    F: Stone[];
    C: Stone[];
}
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPlayerInfo {
    name: string;
    player: Player;
}
export class PlayerInfo {
    public static getTotalStones(stoneBagOrPlayerInfo: StoneBag | PlayerInfo): number {
        if (stoneBagOrPlayerInfo instanceof PlayerInfo) {
            return stoneBagOrPlayerInfo.total;
        } else {
            return stoneBagOrPlayerInfo.F.length + stoneBagOrPlayerInfo.C.length;
        }
    }
    public static getNormalStonesCount(stoneBagOrPlayerInfo: StoneBag | PlayerInfo): number {
        if (stoneBagOrPlayerInfo instanceof PlayerInfo) {
            return stoneBagOrPlayerInfo.normalStonesCount;
        } else {
            return stoneBagOrPlayerInfo.F.length;
        }
    }
    public static getCapstonesCount(stoneBagOrPlayerInfo: StoneBag | PlayerInfo): number {
        if (stoneBagOrPlayerInfo instanceof PlayerInfo) {
            return stoneBagOrPlayerInfo.normalStonesCount;
        } else {
            return stoneBagOrPlayerInfo.C.length;
        }
    }
    public static hasStone(stoneBag: StoneBag, stoneType: StoneType) {
        if (stoneType === StoneType.CAP) {
            return this.getCapstonesCount(stoneBag) > 0;
        } else {
            return this.getNormalStonesCount(stoneBag) > 0;
        }
    }
    public static getStone(stoneBag: StoneBag, type: StoneType): Stone | undefined {
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
    public static createStoneBag(stones: GameStones, player: Player) {
        const flats: Stone[] = Array(stones.F).fill(1).map((_, index) => ({ type: StoneType.FLAT, player, movable: true, position: { square: "", stack: index } }));
        const cap: Stone[] = Array(stones.C).fill(1).map((_, index) => ({ type: StoneType.CAP, player, movable: true, position: { square: "", stack: index + flats.length } }));
        const stoneBag = { C: cap, F: flats };
        return stoneBag;
    }
    public name: string;
    get total() {
        return PlayerInfo.getTotalStones(this.stoneBag);
    }
    get normalStonesCount() {
        return PlayerInfo.getNormalStonesCount(this.stoneBag);
    }
    get capstonesCount() {
        return PlayerInfo.getCapstonesCount(this.stoneBag);
    }
    public player: Player;
    private stoneBag: StoneBag;
    constructor(name: string, player: Player, gameStones: GameStones | StoneBag) {
        this.name = name;
        this.player = player;
        if (typeof gameStones.F === "number" && typeof gameStones.C === "number") {
            this.stoneBag = PlayerInfo.createStoneBag(gameStones as GameStones, player);
        } else {
            this.stoneBag = gameStones as StoneBag;
        }
    }
    public hasStone(stoneType: StoneType) {
        if (stoneType === StoneType.CAP) {
            return this.capstonesCount > 0;
        } else {
            return this.normalStonesCount > 0;
        }
    }
    public getStone(type: StoneType): Stone | undefined {
        return PlayerInfo.getStone(this.stoneBag, type);
    }
}
