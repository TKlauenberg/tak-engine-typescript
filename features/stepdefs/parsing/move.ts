/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { Action, Move, MoveType, parse } from '../../../lib/Move';

Given('A the move {string}', function(move: string) {
  this.moveString = move;
});

When('I parse the PTN move', function() {
  const [result, move] = parse(this.moveString);
  this.parsingResult = result;
  this.move = move;
});

Then('The Move is a place action', function() {
  const move: Action = this.move;
  expect(move.action).to.equal(MoveType.Place);
});

Then('The Move is a move action', function() {
  const move: Action = this.move;
  expect(move.action).to.equal(MoveType.Move);
});

Then('the position is {pos}', function(pos) {
  const move: Action = this.move;
  expect(move.position).to.equal(pos);
});

Then('The starting position is {pos}', function(pos) {
  const move: Move = this.move;
  expect(move.position).to.equal(pos);
});

Then('The direction is {direction}', function(direction) {
  const move: Move = this.move;
  expect(move.direction).to.equal(direction);
});
