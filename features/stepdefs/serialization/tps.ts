/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
import { expect } from 'chai';
import { Then } from 'cucumber';
import { Game } from '../../../lib';

Then('The gamestate as TPS should be {string}', function(tps) {
  expect((this.game as Game).tps).to.equal(tps);
});
