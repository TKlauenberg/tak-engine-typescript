/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
import { expect } from 'chai';
import { Then } from 'cucumber';
import { Player, PlayerInfo } from '../../../lib/Player';
import { Game } from '../../../lib';

Then('{player} has {int} normal stones and {int} capstones',
    function(
        player: Player,
        normalStonesCount: number,
        capstonesCount: number
    ) {
      const game = this.game as Game;
      const playerInfo: PlayerInfo =
        player === Player.One ? game.player1 : game.player2;
      expect(playerInfo.normalStonesCount).to.equal(normalStonesCount);
      expect(playerInfo.capstonesCount).to.equal(capstonesCount);
    });
