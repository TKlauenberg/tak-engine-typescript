import { AnswersQuestions, Question, Answerable } from '@serenity-js/core';
import { Player as PlayerFromLib, Stone, PlayerInfo } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const Player = {
  of: (stone: Answerable<Stone>) =>
    Question.about('the player of the stone', async (actor) => {
      const answeredStone = Question.isAQuestion(stone)
        ? await actor.answer(stone)
        : await stone;
      return answeredStone.player;
    }),
  number: (number: PlayerFromLib): Question<Promise<PlayerInfo>> =>
    Question.about(`player ${number}`, (actor) =>
      PlayTheGame.as(actor).getPlayerInfo(number),
    ),
};
