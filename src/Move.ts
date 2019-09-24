import { Tile } from ".";
import { Board } from "./Board";
import { grammar } from "./grammer";
import { Result } from "./interfaces";
import { PlayerInfo } from "./Player";
import { Stone, StoneType } from "./Stone";

export enum MoveTypes {
    Place = "Place",
    Move = "Move",
}
export enum Direction {
    Up = "+",
    Down = "-",
    Left = "<",
    Right = ">",
}
export interface Place {
    action: MoveTypes.Place;
    position: string;
    stoneType: StoneType;
}
export interface Move {
    action: MoveTypes.Move;
    position: string;
    amount: number;
    direction: Direction;
    drops: number[];
}

export type Action = Place | Move;
export function parse(ptnMove: string): Result<Action> {
    const type = ptnMove.match(grammar.ply_grouped)!;
    if (type[2]) {
        // Move
        const action = MoveTypes.Move;
        const parts = type[2].match(grammar.slide_grouped)!;
        const amount = Number.parseInt(parts[1]) || 1;
        const position = parts[2];
        const direction = parseDirection(parts[3]);
        const drops = parts[4] === "" ? [amount] : Array.from(parts[4]).map((x) => Number.parseInt(x));
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
        const action = MoveTypes.Place;
        const parts = type[3].match(grammar.place_grouped)!;
        const stoneType: StoneType = parts[1] as StoneType || StoneType.FLAT;
        const position = parts[2];
        const move: Action = {
            action,
            stoneType,
            position,
        };
        return [true, move];
    }
    return [false, new Error("move could not be parsed")];
}

function parseDirection(direction: string) {
    switch (direction) {
        case "+": return Direction.Up;
        case "-": return Direction.Down;
        case "<": return Direction.Left;
        case ">": return Direction.Right;
        default: throw new Error(`cannot parse Direction "${direction}"`);
    }
}

export function serialize(action: Action) {
    if (action.action === MoveTypes.Place) {
        const typeString = action.stoneType === StoneType.FLAT ? "" : action.stoneType;
        return `${typeString}${action.position}`;
    } else {
        return `${action.amount}${action.position}${action.direction}${action.drops.join("")}`;
    }
}

export function excecuteMove<T extends Tile[][]>(move: Action, board: T, player: PlayerInfo): Result<T> {
    if (move.action === MoveTypes.Place) {
        const stone = player.getStone(move.stoneType);
        if (stone !== undefined) {
            if (move.stoneType === StoneType.STANDING) {
                stone.type = StoneType.STANDING;
            }
            const square = Board.getSquare(board, move.position);
            if (square.stones.length > 0) {
                return [false, new Error("Cannot place a stone on a non empty board")];
            } else {
                square.drop(stone);
            }
        } else {
            return [false, new Error("Player has not enough stones")];
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
            const dropSquare = Board.getNeighbourSquare(board, move.position, move.direction, i + 1);
            if (dropSquare === undefined) {
                return [false, new Error("Cannot move out of the board")];
            }
            const dropStones: Stone[] = [];
            for (let x = 0; x < move.drops[i]; x++) {
                const stone = stones.shift();
                if (stone === undefined) {
                    return [false, new Error("There aren't enough stones")];
                }
                dropStones.push(stone);
            }
            if (dropSquare.canDrop(...dropStones)) {
                dropSquare.drop(...dropStones);
            } else {
                return [false, new Error("Cannot Drop Stones")];
            }
        }
    }
    return [true, board];
}

// todo create validate function
// validation with error in execute function?
