/**
 * special error Object for parsing errors
 */
export class ParsingError extends Error {
  /**
  *
  * @param {string} message error message
  * @param {string} parsedType type which should be parsed
  * @param {string} text special error message for parsing
  */
  constructor(message: string, public parsedType: string, public text: string) {
    super(message);
  }
}
