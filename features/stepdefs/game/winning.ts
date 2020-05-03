/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
import { expect } from 'chai';
import { Then } from 'cucumber';

Then('the game ends', function() {
  expect(this.game.hasEnded).to.be.true;
});

Then('the result is {string}', function(result) {
  expect(this.game.result).to.equal(result);
});
