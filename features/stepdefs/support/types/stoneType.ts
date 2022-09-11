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
  transformer: (flat: string, cap: string) => {
    if (flat!==undefined) {
      return StoneType.FLAT;
    } else if (cap!==undefined) {
      return StoneType.CAP;
    } else {
      return StoneType.STANDING;
    }
  },
};
defineParameterType(stoneTypeByName);
