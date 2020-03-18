import { expect } from "chai";
import { TableDefinition, Then, When } from "cucumber";
import { Direction, Game, StoneType } from "../../../lib";
import { Action, MoveType, parse as parseMove } from "../../../lib/Move";

function createPlaceAction(stoneType: StoneType, pos: string): Action {
    return {
        action: MoveType.Place,
        position: pos,
        stoneType: stoneType,
    };
}

When("the user places a {stoneTypeByName} at {pos}", function (stoneTypeByName, pos) {
    const move: Action = createPlaceAction(stoneTypeByName, pos);
    (this.game as Game).execute(move);
});

When("the user tries to place a {stoneTypeByName} at {pos}", function (stoneTypeByName, pos) {
    const move: Action = createPlaceAction(stoneTypeByName, pos);
    try {
        (this.game as Game).execute(move);
    } catch (err) {
        this.error = err;
    }
});

function createMoveAction(position: string, direction: Direction, amount: number, drops: number[]): Action {
    return {
        action: MoveType.Move,
        amount: amount,
        direction,
        drops: drops,
        position,
    };
}

When("the user moves one stone from {pos} {direction}", function (position, direction: Direction) {
    const move: Action = createMoveAction(position, direction, 1, [1]);
    (this.game as Game).execute(move);
});

When("the user tries to move one stone from {pos} {direction}", function (position, direction: Direction) {
    const move: Action = createMoveAction(position, direction, 1, [1]);
    try {
        (this.game as Game).execute(move);
    } catch (err) {
        this.error = err;
    }
});

When("the user moves {int} stones from {pos} {direction}, dropping one stone at each square", function (amount: number, position: string, direction: Direction) {
    const drops: number[] = [];
    for (let i = 0; i < amount; i++) {
        drops.push(1);
    }
    const move: Action = createMoveAction(position, direction, amount, drops);
    (this.game as Game).execute(move);
});

When("the user tries to move {int} stones from {pos} {direction}, dropping one stone at each square", function (amount: number, position: string, direction: Direction) {
    const drops: number[] = [];
    for (let i = 0; i < amount; i++) {
        drops.push(1);
    }
    const move: Action = createMoveAction(position, direction, amount, drops);
    try {
        (this.game as Game).execute(move);
    } catch (err) {
        this.error = err;
    }
});

When("the user tries to move {int} stones from {pos} {direction} with all stones", function (amount: number, position: string, direction: Direction) {
    const move: Action = createMoveAction(position, direction, amount, [amount]);
    try {
        (this.game as Game).execute(move);
    } catch (err) {
        this.error = err;
    }
});

When("the user executes these moves", function (dataTable: TableDefinition) {
    const movesStrings: any = dataTable.raw();
    for (const moveString of movesStrings) {
        const [parseSuccessfull, move] = parseMove(moveString[0]);
        if (!parseSuccessfull) {
            throw new Error("Error in feature file! move could not be parsed");
        } else {
            (this.game as Game).execute(move as Action);
        }
    }
});

Then("all stones should have the position of the square and the stack they are placed on", function () {
    const game = this.game as Game;
    game.board.forEach((row) => {
        row.forEach((tile) => {
            const position = tile.position;
            tile.stones.forEach((stone, index) => {
                if (position !== stone.position.square) {
                    throw new Error(`Position doesn't match!\n Tile Position: ${position},\n Stone position: ${stone.position}`);
                }
                if (index !== stone.position.stack) {
                    throw new Error(`Position is not correct!\nExpected Position: ${index}\nStone position: ${stone.position.stack}`);
                }
            });
        });
    });
});
Then("all unmovable stones should have the information movable -> false", function () {
    const game = this.game as Game;
    game.board.forEach((row) => {
        row.forEach((tile) => {
            const stackHeight = tile.stones.length;
            tile.stones.forEach((stone, index) => {
                const shouldBeMovable = index > stackHeight - game.size - 1;
                expect(stone.movable).to.equal(shouldBeMovable, `expected ${shouldBeMovable} but was ${stone.movable}!\njson:${JSON.stringify(tile.stones)}`);
            });
        });
    });
});
