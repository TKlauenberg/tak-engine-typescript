import { Interaction } from '@serenity-js/core';
import { CreateGame } from '../Interactions';

export const InitializeGame = {
  withOptions: CreateGame.withOptions,
  withPtn: (ptn: string): Interaction => CreateGame.withPtn(ptn),
};
