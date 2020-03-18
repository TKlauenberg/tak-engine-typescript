import { expect } from "chai";
import { defineStep, TableDefinition, Then } from "cucumber";
import { Game, Square, Stone, StoneType } from "../../lib";
import { Player } from "../../lib/Player";

// Given and When step
defineStep("the user initializes a game with the parameters", function (dataTable: TableDefinition) {
    const options: any = dataTable.rowsHash();
    for (const key of Object.keys(options)) {
        if (options[key].match(/^[0-9,]+$/)) {
            const int = Number.parseInt(options[key]);
            const float = Number.parseFloat(options[key]);
            if (!isNaN(int)) {
                options[key] = int;
            } else if (!isNaN(float)) {
                options[key] = float;
            }
        }
    }
    this.game = new Game(options);
});

// stack is from bottom to top
Then("On {pos} should be a stack with stones {string}", function (pos: string, stack) {
    const game: Game = this.game;
    const square = game.board.getSquare(pos);
    const squareStack = square.stones.map((x) => x.player === Player.One ? 1 : 2).join("");
    expect(stack).to.equal(squareStack);
});

function checkStack(game: Game, position: string, ...stack: Stone[]) {
    const square = game.board.getSquare(position);
    square.stones.forEach((x, i) => {
        // debug sting because then the chai-js output has more details
        expect(x).to.include(stack[i], "debug");
    });
    // expect(square.stones).to.deep.equal(stack);
}

Then("On {pos} should be a stack with a {stone} and a {stone}", function (pos, stone, stone2) {
    checkStack(this.game, pos, stone, stone2);
});

Then("the top stone on {pos} should be {playerByColor}", function (pos, player) {
    const game: Game = this.game;
    const square = game.board.getSquare(pos);
    expect(square.top.player).to.equal(player);
});

Then("the top stone on {pos} should be of type {stoneType}", function (pos: string, stoneType: StoneType) {
    const game: Game = this.game;
    const square = game.board.getSquare(pos);
    expect(square.top.type).to.equal(stoneType);
});

Then("the next Player should be {player}", function (player) {
    const game = this.game as Game;
    expect(game.currentPlayer.player).to.equal(player);
});

Then("the current Round should be {int}", function (moveCount) {
    const game = this.game as Game;
    expect(game.moveCount).to.equal(moveCount);
});

Then("The size of the board is {int}", function (size) {
    expect(this.game.board.size).to.equal(size);
    expect(this.game.size).to.equal(size);
});

Then("On {pos} is a {stone}", function (pos, stone: Stone) {
    const game: Game = this.game;
    const square = game.board.getSquare(pos);
    expect(square.stones).to.have.length(1);
    expect(square.top).to.include(stone,"debug");
});

Then("The board is empty", function () {
    const game: Game = this.game;
    const board: Square[][] = game.board;
    const isEmpty = board.every((x) => x.every((y) => y.stones.length === 0));
    expect(isEmpty).to.be.true;
});

Then("the user should get an error", function () {
    expect(this.error).to.not.be.undefined;
});

Then("The error message should be {string}", function (errorMessage) {
    const error: Error = this.error;
    expect(error.message).to.equal(errorMessage);
});
