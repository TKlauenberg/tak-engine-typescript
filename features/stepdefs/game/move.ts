import { expect } from "chai";
import { TableDefinition, Then, When } from "cucumber";
import { Direction, Game } from "../../../src";
import { Action, MoveTypes, parse as parseMove } from "../../../src/Move";

When("I place a {stoneTypeByName} at {pos}", function (stoneTypeByName, pos) {
    const move: Action = {
        action: MoveTypes.Place,
        position: pos,
        stoneType: stoneTypeByName,
    };
    const game: Game = this.game;
    try {
        game.execute(move);
    } catch (err) {
        this.error = err;
    }
});

When("I move one stone from {pos} {direction}", function (position, direction: Direction) {
    const move: Action = {
        action: MoveTypes.Move,
        amount: 1,
        direction,
        drops: [1],
        position,
    };
    try {
        (this.game as Game).execute(move);
    } catch (error) {
        this.error = error;
    }
});

When("I move {int} stones from {pos} {direction}, dropping one stone at each square", function (amount: number, position: string, direction: Direction) {
    const drops: number[] = [];
    for (let i = 0; i < amount; i++) {
        drops.push(1);
    }
    const move: Action = {
        action: MoveTypes.Move,
        amount,
        direction,
        drops,
        position,
    };
    try {
        (this.game as Game).execute(move);
    } catch (error) {
        this.error = error;
    }
});

When("I move {int} stones from {pos} {direction} with all stones", function (amount: number, position: string, direction: Direction) {
    const move: Action = {
        action: MoveTypes.Move,
        amount,
        direction,
        drops: [amount],
        position,
    };
    try {
        (this.game as Game).execute(move);
    } catch (error) {
        this.error = error;
    }
});
When("I execute these moves", function (dataTable: TableDefinition) {
    const movesStrings: any = dataTable.raw();
    for (const moveString of movesStrings) {
        const [parseSuccessfull, move] = parseMove(moveString[0]);
        if (!parseSuccessfull) {
            throw new Error("Error in feature file! move could not be parsed");
        } else {
            try {
                (this.game as Game).execute(move as Action);
            } catch (error) {
                this.error = error;
            }
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
