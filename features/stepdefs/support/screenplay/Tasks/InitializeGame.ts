import { CreateGame } from '../Interactions';
import { Interaction } from '@serenity-js/core';

export const InitializeGame = {
  withOptions: CreateGame.withOptions,
  withPtn: (ptn: string): Interaction => CreateGame.withPtn(ptn),
};
