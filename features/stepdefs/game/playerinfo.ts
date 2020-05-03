/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
import { expect } from 'chai';
import { Then } from 'cucumber';
import { Player, PlayerInfo } from '../../../lib/Player';

Then('{player} has {int} normal stones and {int} capstones',
    function(
        player: Player,
        normalStonesCount: number,
        capstonesCount: number
    ) {
      const playerInfo: PlayerInfo =
        player === Player.One ? this.game.player1 : this.game.player2;
      expect(playerInfo.normalStonesCount).to.equal(normalStonesCount);
      expect(playerInfo.capstonesCount).to.equal(capstonesCount);
    });
