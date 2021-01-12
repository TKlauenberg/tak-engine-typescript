import { DataTable } from '@cucumber/cucumber';
import { GameOptions } from '../../../../lib';

/**
 *
 * @param {DataTable} table cucumber table definition
 * @return {GameOptions}
 */
export function gameOptionsFromTable(table: DataTable): GameOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: { [key: string]: string | number } = table.rowsHash();
  for (const key of Object.keys(options)) {
    const option = options[key] as string;
    if (/^[0-9,]+$/.test(option)) {
      const int = Number.parseInt(option);
      const float = Number.parseFloat(option);
      if (!isNaN(int)) {
        options[key] = int;
      } else if (!isNaN(float)) {
        options[key] = float;
      }
    }
  }
  return (options as unknown) as GameOptions;
}
