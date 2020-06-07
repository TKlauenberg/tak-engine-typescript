import { Question } from '@serenity-js/core';
import { Stone } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const TopStone = {
  on: (pos: string): Question<Promise<Stone>> =>
    Question.about(
      `top stone on ${pos}`,
      async (actor) => (await PlayTheGame.as(actor).squareOnPosition(pos)).top,
    ),
};
