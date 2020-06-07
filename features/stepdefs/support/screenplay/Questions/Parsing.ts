import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const Parsing = {
  result: (): Question<Promise<boolean>> =>
    Question.about('the parsing result', (actor) =>
      PlayTheGame.as(actor).getResult(),
    ),
};
