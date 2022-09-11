import { defineParameterType } from '@cucumber/cucumber';
import { parseStoneType, StoneType } from '../../../../lib';

defineParameterType({
  name: 'stoneType',
  regexp: /[FSC]/,
  transformer: (x: string) => {
    const [parseResult, type] = parseStoneType(x);
    if (parseResult) {
      return type as StoneType;
    } else {
      throw Error;
    }
  },
});

defineParameterType({
  name: 'stoneTypeByName',
  regexp: /(flat stone)|(capstone)|(standing stone)/,
  transformer: (flat: string, cap: string) => {
    if (flat !== undefined) {
      return StoneType.FLAT;
    } else if (cap !== undefined) {
      return StoneType.CAP;
    } else {
      return StoneType.STANDING;
    }
  },
});
