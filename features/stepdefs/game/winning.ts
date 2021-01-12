/* eslint-disable new-cap */
import { actorInTheSpotlight } from '@serenity-js/core';
import { Then } from '@cucumber/cucumber';
import { CheckThat } from '../support';

Then('the game ends', () =>
  actorInTheSpotlight().attemptsTo(CheckThat.theGame.hasEnded()),
);

Then('the result is {string}', (result: string) =>
  actorInTheSpotlight().attemptsTo(CheckThat.theGame.hasTheResult(result)),
);
