import { Answerable, Question } from '@serenity-js/core';

interface ObjectWithLength {
  length: number;
}

export const Length = {
  of: (obj: Answerable<ObjectWithLength>) =>
    Question.about('the length of', async (actor) => {
      let answered: ObjectWithLength;
      if (Question.isAQuestion(obj)) {
        answered = await actor.answer(obj);
      } else {
        answered = await obj;
      }
      return answered.length;
    }),
};
