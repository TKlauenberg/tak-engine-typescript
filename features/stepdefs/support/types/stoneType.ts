import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { parseStoneType, StoneType } from '../../../../lib';

const stoneType: IParameterTypeDefinition<StoneType> = {
  name: 'stoneType',
  regexp: /[FSC]/,
  transformer: (x: string) => {
    const [parseResult, type] = parseStoneType(x);
    if (parseResult) {
      return (type as StoneType);
    } else {
      throw Error;
    }
  },
};
defineParameterType(stoneType);
const stoneTypeByName: IParameterTypeDefinition<StoneType> = {
  name: 'stoneTypeByName',
  regexp: /(flat stone)|(capstone)|(standing stone)/,
  transformer: (x: string) => {
    const match = /(flat stone)|(capstone)|(standing stone)/.exec(x)!;
    if (match[1]) {
      return StoneType.FLAT;
    } else if (match[2]) {
      return StoneType.CAP;
    } else {
      return StoneType.STANDING;
    }
  },
};
defineParameterType(stoneTypeByName);
