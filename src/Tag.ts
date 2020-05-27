import { ParsingError } from './Errors';
import { grammar } from './grammar';

/**
 * Representation of Tags in PTN files
 */
export class Tag {
  /**
   * lowercase name in order to compare to other tags
   * because PTN tags are case insensitive
   */
  get key(): string {
    return this.name.toLowerCase();
  }
  /**
   * parse single Tag line
   * @param {string} tagString complete tag line in PTN file
   * @return {Result<Tag>}
   */
  public static parse(tagString: string): [false, ParsingError] | [true, Tag] {
    const parts = grammar.tagGrouped.exec(tagString);
    if (!parts) {
      return [
        false,
        new ParsingError('Tag could not be parsed', 'Tag', tagString),
      ];
    }
    return [true, new Tag(parts[2], parts[5])];
  }
  public name: string;
  public value: string;
  /**
   * create a new Tag
   * @param {string} name name of the Tag
   * @param {string} value value of the TAg
   */
  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
