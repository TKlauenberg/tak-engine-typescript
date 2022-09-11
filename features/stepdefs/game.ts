/* eslint-disable new-cap */
import { DataTable, Given, Then } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { Player, Stone, StoneType } from '../../lib';
import { CheckThat, gameOptionsFromTable as fromTable } from './support';
import { InitializeGame } from './support/screenplay/Tasks/InitializeGame';

// Given and When step
Given(
  '{word} initializes a game with the parameters',
  (actor: string, datatable: DataTable) =>
    actorCalled(actor).attemptsTo(
      InitializeGame.withOptions(fromTable(datatable)),
    ),
);

// stack is from bottom to top
Then(
  'On {pos} should be a stack with stones "{stack}"',
  (pos: string, stack: Stone[]) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theStack.equals(stack),
    ),
);

Then(
  'On {pos} should be a stack with a {stone} and a {stone}',
  (pos: string, stone: Stone, stone2: Stone) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theStack.equals([stone, stone2]),
    ),
);

Then(
  'the top stone on {pos} should be {playerByColor}',
  (pos: string, player: Player) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theTopStone.isFromPlayer(player),
    ),
);

Then(
  'the top stone on {pos} should be of type {stoneType}',
  (pos: string, stoneType: StoneType) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.onPos(pos).theTopStone.isOfType(stoneType),
    ),
);

Then('the next Player should be {player}', (player: Player) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theNextPlayerIs(player)),
);

Then('the current Round should be {int}', (moveCount: number) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theCurrentRoundIs(moveCount)),
);

Then('The size of the board is {int}', (size: number) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theSizeOfTheBoardIs(size)),
);

Then('On {pos} is a {stone}', (pos: string, stone: Stone) =>
  actorInTheSpotlight().attemptsTo(
    CheckThat.onPos(pos).theStack.hasOnlyTheStone(stone),
  ),
);

Then('The board is empty', () =>
  actorInTheSpotlight().attemptsTo(CheckThat.theBoardIsEmpty()),
);

Then('{word} should get an error', (actor: string) =>
  actorCalled(actor).attemptsTo(CheckThat.theLastError.exists()),
);

Then('The error message should be {string}', (errorMessage: string) =>
  actorInTheSpotlight().attemptsTo(
    CheckThat.theLastError.hasTheMessage(errorMessage),
  ),
);
