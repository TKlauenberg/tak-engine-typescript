import { Question } from '@serenity-js/core';
import { Player as IPlayer } from '../../../../../lib';
import { Player } from './Player';

export const AmountOf = {
  normalStonesFromPlayer: (player: IPlayer): Question<Promise<number>> =>
    Question.about(
      `amount of normal Stones from Player ${player}`,
      async (actor) =>
        (await actor.answer(Player.number(player))).normalStonesCount,
    ),
  capstonesFromPlayer: (player: IPlayer): Question<Promise<number>> =>
    Question.about(
      `amount of Capstones from Player ${player}`,
      async (actor) =>
        (await actor.answer(Player.number(player))).capstonesCount,
    ),
};
