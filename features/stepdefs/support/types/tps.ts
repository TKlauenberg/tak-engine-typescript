import { defineParameterType, Transform } from 'cucumber';

const tps: Transform = {
  name: 'tps',
  regexp: /[1 - 8xSC/,]+\s+[1,2]\s+\d+/,
  transformer: (x: string) => x,
};
defineParameterType(tps);
