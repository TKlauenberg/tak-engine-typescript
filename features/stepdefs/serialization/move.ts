/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { Direction, Move, MoveType, Place, serialize, StoneType } from '../../../lib';

Given('a place move with a {stoneTypeByName} at {pos}',
    function(stoneType: StoneType, position: string) {
      const move: Place = {
        action: MoveType.Place,
        stoneType,
        position,
      };
      this.move = move;
    });

Given('a move Action on {pos} with {int} stones into {direction} and {string}',
    function(
        position: string,
        amount: number,
        direction: Direction,
        drops: string
    ) {
      const move: Move = {
        action: MoveType.Move,
        amount,
        direction,
        drops: drops.split('').map((x) => parseInt(x)),
        position,
      };
      this.move = move;
    });

When('I serialize the move', function() {
  this.string = serialize(this.move);
});

Then('the string matches {string}', function(value) {
  expect(this.string).equals(value);
});
