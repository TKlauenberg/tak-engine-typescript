import { Answerable, Question } from '@serenity-js/core';
import { Stone } from '../../../../../lib';

export const Type = {
  of: (stone: Answerable<Stone>) =>
    Question.about('the type of the stone', async (actor) => {
      const answeredStone = Question.isAQuestion(stone)
        ? await actor.answer(stone)
        : await stone;
      return answeredStone.type;
    }),
};
