/* eslint-disable new-cap */
import { Then, When } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { CheckThat, InitializeGame } from '../support';

When('{word} parse the PTN file', (actor: string, docString: string) =>
  actorCalled(actor).attemptsTo(InitializeGame.withPtn(docString)),
);

Then('The parsing should be unsuccessful', () =>
  actorInTheSpotlight().attemptsTo(CheckThat.theParsing.wasUnsuccessfull()),
);

Then('The parsing should be successful', () =>
  actorInTheSpotlight().attemptsTo(CheckThat.theParsing.wasSuccessfull()),
);
