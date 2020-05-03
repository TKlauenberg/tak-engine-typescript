/**
 * function which can be used in a .filter method
 * in order to filter undefined values
 * and also have the typing of TypeScript correct.
 * @param {T} x element or undefined
 * @return {boolean}
 */
export function filterUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
