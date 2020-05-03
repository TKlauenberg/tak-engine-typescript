/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
import { expect } from 'chai';
import { Then } from 'cucumber';

Then('The gamestate as TPS should be {string}', function(tps) {
  expect(this.game.tps).to.equal(tps);
});
