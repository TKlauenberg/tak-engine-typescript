import { Question } from '@serenity-js/core';
import { Stone } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const Stack = {
  on: (pos: string): Question<Promise<Stone[]>> =>
    Question.about(`top stone on ${pos}`, (actor) =>
      PlayTheGame.as(actor).stackOnPosition(pos),
    ),
};
