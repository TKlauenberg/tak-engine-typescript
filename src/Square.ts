import { ICloneable } from "./interfaces";
import { Stone, StoneType } from "./Stone";

export enum Edge {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

export class Square implements ICloneable<Square> {
    public get top() {
        return Square.getTop(this._stones);
    }
    public get isEmpty() {
        return this._stones.length === 0;
    }
    public get hasStones() {
        return this._stones.length > 0;
    }

    public get stones() {
        return this._stones;
    }
    public static getTop(tile: Stone[]) {
        return tile[tile.length - 1];
    }
    /**
     * Test if stones can be dropped on square
     * @param stones Stone[] stones which are tested
     */
    public static canDropStones(tile: Stone[], ...stones: Stone[]): [true] | [false, Error] {
        if (tile.length === 0) {
            return [true];
        }
        switch (Square.getTop(tile).type) {
            case StoneType.FLAT: return [true];
            case StoneType.STANDING:
                if (stones.length === 1) {
                    if (stones[0].type === StoneType.CAP) {
                        return [true];
                    } else {
                        return [false, new Error("Can only flatten a wall with a capstone")];
                    }
                } else {
                    return [false, new Error("Can only flatten a wall with one capstone")];
                }
            case StoneType.CAP: return [false, new Error("Cannot move a stone onto a capstone")];
            default: return [false, new Error("Top tile is not a stone")];
        }
    }
    /**
     * Drop new stones on tile
     * @param stones stones to be dropped
     * @returns Stone[] new Tile stones
     */
    public static drop(position: string, boardSize: number, tile: Stone[], ...stones: Stone[]): Stone[] {
        const [canDrop, reason] = Square.canDropStones(tile, ...stones);
        if (canDrop) {
            if (Square.getTop(tile) !== undefined && Square.getTop(tile).type === StoneType.STANDING) {
                // flattening wall
                Square.getTop(tile).type = StoneType.FLAT;
            }
            const resultStack = [...tile, ...stones];
            resultStack.forEach((stone, index) => {
                stone.position = {
                    square: position,
                    stack: index,
                };
                stone.movable = index > resultStack.length - boardSize - 1;
            });
            return resultStack;
        } else {
            throw reason;
        }
    }
    /**
     * take stones from square
     * @param count amount of stones to take
     */
    public static take(tile: Stone[], count: number) {
        if (count > tile.length) {
            throw new Error(`There are ${tile.length} stones on this square. Cannot move ${count} stones`);
        } else {
            const stones: Stone[] = [];
            for (let i = 0; i < count; i++) {
                stones.unshift(tile.pop()!);
            }
            return stones;
        }
    }
    public position: string;
    // tslint:disable-next-line: variable-name
    private _stones: Stone[];
    private boardSize: number;
    constructor(position: string, boardSize: number, ...stones: Stone[]) {
        this.position = position;
        this._stones = stones;
        this.boardSize = boardSize;
        this._stones.forEach((stone, index) => { stone.movable = index > stones.length - boardSize - 1; });
    }
    /**
     * Test if stones can be dropped on square
     * @param stones Stone[] stones which are tested
     */
    public canDrop(...stones: Stone[]): [true] | [false, Error] {
        return Square.canDropStones(this._stones, ...stones);
    }
    /**
     * Drop new stones on square
     * @param stones stones to be dropped
     */
    public drop(...stones: Stone[]) {
        this._stones = Square.drop(this.position, this.boardSize, this._stones, ...stones);
    }
    /**
     * take stones from square
     * @param count amount of stones to take
     */
    public take(count: number) {
        return Square.take(this._stones, count);
    }
    public clone() {
        return new Square(this.position, this.boardSize, ...this._stones);
    }
}
