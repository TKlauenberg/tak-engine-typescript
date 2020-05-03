/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
import { expect } from 'chai';
import { TableDefinition, Then, When } from 'cucumber';
import { Direction, Game, StoneType } from '../../../lib';
import { Action, MoveType, parse as parseMove } from '../../../lib/Move';

/**
 * create a place action with params
 * @param {StoneType} stoneType type of the stone
 * @param {string} pos position for the place action
 * @return {Action}
 */
function createPlaceAction(stoneType: StoneType, pos: string): Action {
  return {
    action: MoveType.Place,
    position: pos,
    stoneType: stoneType,
  };
}

When('the user places a {stoneTypeByName} at {pos}',
    function(stoneTypeByName, pos) {
      const move: Action = createPlaceAction(stoneTypeByName, pos);
      (this.game as Game).execute(move);
    });

When('the user tries to place a {stoneTypeByName} at {pos}',
    function(stoneTypeByName, pos) {
      const move: Action = createPlaceAction(stoneTypeByName, pos);
      try {
        (this.game as Game).execute(move);
      } catch (err) {
        this.error = err;
      }
    });

/**
 * create a move action from params
 * @param {string} position ptn position string
 * @param {Direction} direction direction of the move
 * @param {number} amount amount of stones
 * @param {Array<number>} drops drop array for the move
 * @return {Action}
 */
function createMoveAction(
    position: string,
    direction: Direction,
    amount: number,
    drops: number[]
): Action {
  return {
    action: MoveType.Move,
    amount: amount,
    direction,
    drops: drops,
    position,
  };
}

When('the user moves one stone from {pos} {direction}',
    function(position, direction: Direction) {
      const move: Action = createMoveAction(position, direction, 1, [1]);
      (this.game as Game).execute(move);
    });

When('the user tries to move one stone from {pos} {direction}',
    function(position: string, direction: Direction) {
      const move: Action = createMoveAction(position, direction, 1, [1]);
      try {
        (this.game as Game).execute(move);
      } catch (err) {
        this.error = err;
      }
    });

// eslint-disable-next-line max-len
When('the user moves {int} stones from {pos} {direction}, dropping one stone at each square',
    function(amount: number, position: string, direction: Direction) {
      const drops: number[] = [];
      for (let i = 0; i < amount; i++) {
        drops.push(1);
      }
      const move: Action = createMoveAction(position, direction, amount, drops);
      (this.game as Game).execute(move);
    });

// eslint-disable-next-line max-len
When('the user tries to move {int} stones from {pos} {direction}, dropping one stone at each square',
    function(amount: number, position: string, direction: Direction) {
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

// eslint-disable-next-line max-len
When('the user tries to move {int} stones from {pos} {direction} with all stones',
    function(amount: number, position: string, direction: Direction) {
      const move: Action =
        createMoveAction(position, direction, amount, [amount]);
      try {
        (this.game as Game).execute(move);
      } catch (err) {
        this.error = err;
      }
    });

When('the user executes these moves', function(dataTable: TableDefinition) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movesStrings: any = dataTable.raw();
  for (const moveString of movesStrings) {
    const [parseSuccessfull, move] = parseMove(moveString[0]);
    if (!parseSuccessfull) {
      throw new Error('Error in feature file! move could not be parsed');
    } else {
      (this.game as Game).execute(move as Action);
    }
  }
});

// eslint-disable-next-line max-len
Then('all stones should have the position of the square and the stack they are placed on', function() {
  const game = this.game as Game;
  game.board.forEach((row) => {
    row.forEach((tile) => {
      const position = tile.position;
      tile.stones.forEach((stone, index) => {
        if (position !== stone.position.square) {
          // eslint-disable-next-line max-len
          throw new Error(`Position doesn't match!\n Tile Position: ${position},\n Stone position: ${stone.position}`);
        }
        if (index !== stone.position.stack) {
          // eslint-disable-next-line max-len
          throw new Error(`Position is not correct!\nExpected Position: ${index}\nStone position: ${stone.position.stack}`);
        }
      });
    });
  });
});

// eslint-disable-next-line max-len
Then('all unmovable stones should have the information movable -> false', function() {
  const game = this.game as Game;
  game.board.forEach((row) => {
    row.forEach((tile) => {
      const stackHeight = tile.stones.length;
      tile.stones.forEach((stone, index) => {
        const shouldBeMovable = index > stackHeight - game.size - 1;
        // eslint-disable-next-line max-len
        expect(stone.movable).to.equal(shouldBeMovable, `expected ${shouldBeMovable} but was ${stone.movable}!\njson:${JSON.stringify(tile.stones)}`);
      });
    });
  });
});
