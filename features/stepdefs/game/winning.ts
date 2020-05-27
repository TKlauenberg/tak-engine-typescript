/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
import { expect } from 'chai';
import { Then } from 'cucumber';
import { Game } from '../../../lib';

Then('the game ends', function() {
  expect((this.game as Game).hasEnded).to.be.true;
});

Then('the result is {string}', function(result) {
  expect((this.game as Game).result).to.equal(result);
});
