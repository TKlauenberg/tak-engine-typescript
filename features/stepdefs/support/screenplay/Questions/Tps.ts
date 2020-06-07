import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const Tps = {
  ofTheGame: (): Question<Promise<string>> =>
    Question.about('the tps of the game', (actor) =>
      PlayTheGame.as(actor).getTps(),
    ),
};
