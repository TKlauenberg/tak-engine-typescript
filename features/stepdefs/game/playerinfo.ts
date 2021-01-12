/* eslint-disable new-cap */
import { actorInTheSpotlight } from '@serenity-js/core';
import { Then } from '@cucumber/cucumber';
import { Player } from '../../../lib/Player';
import { CheckThat } from '../support';

Then(
  '{player} has {int} normal stones and {int} capstones',
  (player: Player, normalStonesCount: number, capstonesCount: number) =>
    actorInTheSpotlight().attemptsTo(
      CheckThat.thePlayer(player)
        .has(normalStonesCount)
        .stonesAnd(capstonesCount).capstones,
    ),
);
