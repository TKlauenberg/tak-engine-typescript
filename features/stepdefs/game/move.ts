/* eslint-disable new-cap */
import { actorInTheSpotlight } from '@serenity-js/core';
import { When } from 'cucumber';
import { Direction } from '../../../lib';
import { Move, Place, TriesToMove, TriesToPlace } from '../support';

When('the user places a {stoneTypeByName} at {pos}', (stoneTypeByName, pos) =>
  actorInTheSpotlight().attemptsTo(Place.a(stoneTypeByName).on(pos)),
);

When(
  'the user tries to place a {stoneTypeByName} at {pos}',
  (stoneTypeByName, pos) =>
    actorInTheSpotlight().attemptsTo(TriesToPlace.a(stoneTypeByName).on(pos)),
);

When(
  'the user moves one stone from {pos} {direction}',
  (pos, direction: Direction) =>
    actorInTheSpotlight().attemptsTo(
      Move(1).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

When(
  'the user tries to move one stone from {pos} {direction}',
  (pos: string, direction: Direction) =>
    actorInTheSpotlight().attemptsTo(
      TriesToMove(1).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  'the user moves {int} stones from {pos} {direction}, dropping one stone at each square',
  (amount: number, pos: string, direction: Direction) =>
    actorInTheSpotlight().attemptsTo(
      Move(amount).from(pos).moving(direction).droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  'the user tries to move {int} stones from {pos} {direction}, dropping one stone at each square',
  (amount: number, pos: string, direction: Direction) =>
    actorInTheSpotlight().attemptsTo(
      TriesToMove(amount)
        .from(pos)
        .moving(direction)
        .droppingOneStoneOnEachSquare(),
    ),
);

// eslint-disable-next-line max-len
When(
  'the user tries to move {int} stones from {pos} {direction} with all stones',
  (amount: number, position: string, direction: Direction) =>
    actorInTheSpotlight().attemptsTo(
      TriesToMove(amount)
        .from(position)
        .moving(direction)
        .movingTheCompleteStack(),
    ),
);
