import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'tps',
  regexp: /[1 - 8xSC/,]+\s+[1,2]\s+\d+/,
  transformer: (x: string) => x,
});
