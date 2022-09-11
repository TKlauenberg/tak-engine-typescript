import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const nextPlayer = Question.about('the next player', (actor) =>
  PlayTheGame.as(actor).nextPlayer(),
);
