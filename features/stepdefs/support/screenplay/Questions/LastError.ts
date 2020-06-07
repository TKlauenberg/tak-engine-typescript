import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const LastError = {
  exists: (): Question<Promise<boolean>> =>
    Question.about(
      'last error exists',
      async (actor) => (await PlayTheGame.as(actor).lastError()) !== undefined,
    ),
  message: (): Question<Promise<string>> =>
    Question.about(
      'last error message',
      async (actor) => (await PlayTheGame.as(actor).lastError()).message,
    ),
};
