import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

const tps: IParameterTypeDefinition<string> = {
  name: 'tps',
  regexp: /[1 - 8xSC/,]+\s+[1,2]\s+\d+/,
  transformer: (x: string) => x,
};
defineParameterType(tps);
