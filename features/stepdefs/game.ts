/* eslint-disable new-cap */
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { defineStep, TableDefinition, Then } from 'cucumber';
import { CheckThat, gameOptionsFromTable as fromTable } from './support';
import { InitializeGame } from './support/screenplay/Tasks/InitializeGame';

// Given and When step
defineStep(
  '{word} initializes a game with the parameters',
  (actor, datatable: TableDefinition) =>
    actorCalled(actor).attemptsTo(
      InitializeGame.withOptions(fromTable(datatable)),
    ),
);

// stack is from bottom to top
Then('On {pos} should be a stack with stones "{stack}"', (pos, stack) =>
  actorInTheSpotlight().attemptsTo(CheckThat.onPos(pos).theStack.equals(stack)),
);

Then(
  'On {pos} should be a stack with a {stone} and a {stone}',
  (pos, stone, stone2) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theStack.equals([stone, stone2]),
    ),
);

Then('the top stone on {pos} should be {playerByColor}', (pos, player) =>
  actorInTheSpotlight().attemptsTo(
    CheckThat.onPos(pos).theTopStone.isFromPlayer(player),
  ),
);

Then(
  'the top stone on {pos} should be of type {stoneType}',
  (pos: string, stoneType) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theTopStone.isOfType(stoneType),
    ),
);

Then('the next Player should be {player}', (player) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theNextPlayerIs(player)),
);

Then('the current Round should be {int}', (moveCount) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theCurrentRoundIs(moveCount)),
);

Then('The size of the board is {int}', (size) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theSizeOfTheBoardIs(size)),
);

Then('On {pos} is a {stone}', (pos, stone) =>
  actorInTheSpotlight().attemptsTo(
    CheckThat.onPos(pos).theStack.hasOnlyTheStone(stone),
  ),
);

Then('The board is empty', () =>
  actorInTheSpotlight().attemptsTo(CheckThat.theBoardIsEmpty()),
);

Then('{word} should get an error', (actor) =>
  actorCalled(actor).attemptsTo(CheckThat.theLastError.exists()),
);

Then('The error message should be {string}', (errorMessage) =>
  actorInTheSpotlight().attemptsTo(
    CheckThat.theLastError.hasTheMessage(errorMessage),
  ),
);
