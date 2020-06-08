/* eslint-disable new-cap */
import { actorInTheSpotlight, actorCalled } from '@serenity-js/core';
import { When } from 'cucumber';
import { Direction } from '../../../lib';
import { Move, Place, TriesToMove, TriesToPlace } from '../support';

When(
  '{word} places a {stoneTypeByName} at {pos}',
  (actor, stoneTypeByName, pos) =>
    actorCalled(actor).attemptsTo(Place.a(stoneTypeByName).on(pos)),
);

When(
  '{word} tries to place a {stoneTypeByName} at {pos}',
  (actor, stoneTypeByName, pos) =>
    actorCalled(actor).attemptsTo(TriesToPlace.a(stoneTypeByName).on(pos)),
);

When(
  '{word} moves one stone from {pos} {direction}',
  (actor, pos, direction: Direction) =>
    actorCalled(actor).attemptsTo(
      Move(1).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

When(
  '{word} tries to move one stone from {pos} {direction}',
  (actor, pos: string, direction: Direction) =>
    actorCalled(actor).attemptsTo(
      TriesToMove(1).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  '{word} moves {int} stones from {pos} {direction}, dropping one stone at each square',
  (actor, amount: number, pos: string, direction: Direction) =>
    actorCalled(actor).attemptsTo(
      Move(amount).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  '{word} tries to move {int} stones from {pos} {direction}, dropping one stone at each square',
  (actor, amount: number, pos: string, direction: Direction) =>
    actorCalled(actor).attemptsTo(
      TriesToMove(amount)
        .from(pos)
        .moving(direction)
        .droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  '{word} tries to move {int} stones from {pos} {direction} with all stones',
  (actor, amount: number, position: string, direction: Direction) =>
    actorCalled(actor).attemptsTo(
      TriesToMove(amount)
        .from(position)
        .moving(direction)
        .movingTheCompleteStack(),
    ),
);
