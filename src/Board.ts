import { ICloneable, Result } from "./interfaces";
import { Direction } from "./Move";
import { Player } from "./Player";
import { Square } from "./Square";
import { StoneType } from "./Stone";
import { filterUndefined, range } from "./util";

const stoneCounts = new Map([
    [3, { F: 10, C: 0, total: 10 }],
    [4, { F: 15, C: 0, total: 15 }],
    [5, { F: 21, C: 1, total: 22 }],
    [6, { F: 30, C: 1, total: 31 }],
    [8, { F: 50, C: 2, total: 52 }],
]);
enum Edge {
    None = 0,
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}
const TopToBottom = Edge.Top | Edge.Bottom;
const LeftToRight = Edge.Left | Edge.Right;

type RoadTile = Square & { edges: Edge };
export interface GameStones { F: number; C: number }
export function getStoneCount(size: number): Result<GameStones> {
    if (stoneCounts.has(size)) {
        return [true, stoneCounts.get(size)!];
    } else {
        return [false, new Error("size not available")];
    }
}

const startRowCharCode = "a".charCodeAt(0);

export class Board extends Array<Square[]> implements ICloneable<Board> {
    public get size() {
        return this.length;
    }
    public get tps() {
        return Board.getTps(this);
    }
    public static getTps(board: Square[][]) {
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
                    const tileTps = square.stones.map((x) => x.player === Player.One ? "1" : "2").reduce((x, y) => x + y, "");
                    const stoneType = square.top.type === StoneType.FLAT ? "" : square.top.type;
                    parts.push(tileTps + stoneType);
                }
            }
            if (countEmpty > 0) {
                parts.push(`x${countEmpty}`);
            }
            const rowTps = parts.join(",");
            rows.push(rowTps);
        }
        return rows.reverse().join("/");
    }
    public get roads() {
        return Board.getRoads(this);
    }
    public static getRoads(board: Square[][]) {
        const bottom = board[0];
        // indexes from 1 to size - 2 so we don't get tiles multiple times
        const indexes = Array.from(range(1, board.length - 1));
        const left = indexes.map((x) => board[x][0]);
        const borderTiles = bottom.concat(left)
            .filter((x) => x.top !== undefined && x.top.type !== StoneType.STANDING);
        return borderTiles
            .map((x) => Board.findRoadsFromTile(board, x))
            .reduce((x, y) => x.concat(y), []);
    }
    public get isFull() {
        return Board.isBoardFull(this);
    }
    public get score() {
        return [Board.getScore(this, Player.One), Board.getScore(this, Player.Two)];
    }
    public static getScore(board: Square[][], player: Player): number;
    public static getScore(board: Square[][]): [number, number];
    public static getScore(board: Square[][], player?: Player) {
        if (player === undefined) {
            return [Board.getScore(board, Player.One), Board.getScore(board, Player.Two)];
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
    public static isBoardFull(board: Square[][]) {
        return board.every((x) => x.every((y) => y.hasStones));
    }
    public static clone(board: Square[][]) {
        const newBoard = board.map((x) => x.map((y) => y.clone()));
        return newBoard;
    }
    public static getSquare(board: Square[][], position: string) {
        const [row, column] = Board.getPosition(position);
        return board[row][column];
    }
    public static getNeighbourSquare(board: Square[][], position: string, direction: Direction, length = 1) {
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
    public static getAllNeighbourSquares(board: Square[][], position: string): Square[] {
        const [row, column] = Board.getPosition(position);
        const up = board[row + 1] === undefined ? undefined : board[row + 1][column];
        const down = board[row - 1] === undefined ? undefined : board[row - 1][column];
        const left = board[row][column - 1];
        const right = board[row][column + 1];
        return [up, down, left, right].filter(filterUndefined);
    }
    public static getPosition(position: string): [number, number] {
        const aCharCode = "a".charCodeAt(0);
        const [a, b] = position.split("");
        const column = a.charCodeAt(0) - aCharCode;
        const row = Number.parseInt(b) - 1;
        return [row, column];
    }
    private static getEdges(board: Square[][], position: string) {
        const [x, y] = Board.getPosition(position);
        let edge: Edge = Edge.None;
        if (x === 0) {
            edge += Edge.Left;
        } else if (x === board.length - 1) {
            edge += Edge.Right;
        }
        if (y === 0) {
            edge += Edge.Bottom;
        } else if (y === board.length - 1) {
            edge += Edge.Top;
        }
        return edge;
    }
    private static findRoadsFromTile(board: Square[][], tile: Square, road: RoadTile[] = []): RoadTile[][] {
        const edges = Board.getEdges(board, tile.position);
        const roadTile = tile as RoadTile;
        roadTile.edges = edges;
        road.push(roadTile);
        const roadEdges = road.reduce((x, y) => x | y.edges, Edge.None);
        const isTopToBottom = (roadEdges & TopToBottom) === TopToBottom;
        const isLeftToRight = (roadEdges & LeftToRight) === LeftToRight;
        if (isTopToBottom || isLeftToRight) {
            return [road];
        } else {
            const neighbours = Board.getAllNeighbourSquares(board, tile.position);
            const positions = road.map((x) => x.position);
            const roads = neighbours
                // filter empty tiles
                .filter((x) => x.top !== undefined)
                // only flat or capstones
                .filter((x) => x.top.type === StoneType.FLAT || x.top.type === StoneType.CAP)
                // road must be from the same player
                .filter((x) => x.top.player === tile.top.player)
                // filter tiles which were already part of the road to mitigate circles
                .filter((x) => positions.every((y) => x.position !== y))
                .map((x) => Board.findRoadsFromTile(board, x, road))
                .reduce((x, y) => x.concat(y), []);
            return roads;
        }
    }
    constructor(size: number, board?: Square[][]) {
        if (board === undefined) {
            super(size);
            for (let i = 0; i < this.length; i++) {
                const row = new Array(size);
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
    public clone() {
        const newBoard = Board.clone(this);
        return new Board(this.size, newBoard);
    }
    public getSquare(position: string) {
        return Board.getSquare(this, position);
    }
    public getNeighbourSquare(position: string, direction: Direction, length = 1) {
        return Board.getNeighbourSquare(this, position, direction, length);
    }
    public getAllNeighbourSquares(position: string): Square[] {
        return Board.getAllNeighbourSquares(this, position);
    }
}
