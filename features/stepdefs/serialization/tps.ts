/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { CheckThat } from '../support';

Then('The gamestate as TPS should be {string}', (tps: string) =>
  CheckThat.theTpsOfTheGameIs(tps),
);
