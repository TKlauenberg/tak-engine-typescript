import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'pos',
  regexp: /[a-h][1-8]/,
  transformer: (x: string) => x,
});
