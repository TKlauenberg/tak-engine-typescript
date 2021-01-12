import { defineParameterType } from '@cucumber/cucumber';
import { IParameterTypeDefinition } from '@cucumber/cucumber/lib/support_code_library_builder/types';

const Position: IParameterTypeDefinition<string> = {
  name: 'pos',
  regexp: /[a-h][1-8]/,
  transformer: (x: string) => x,
};
defineParameterType(Position);
