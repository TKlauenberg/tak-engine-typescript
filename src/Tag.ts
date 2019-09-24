import { ParsingError } from "./Errors";
import { grammar } from "./grammer";

export class Tag {
    get key() {
        return this.name.toLowerCase();
    }
    public static parse(tagString: string): [false, ParsingError] | [true, Tag] {
        const parts = tagString.match(grammar.tag_grouped);
        if (!parts) {
            return [false, new ParsingError("Tag could not be parsed", "Tag", tagString)];
        }
        return [true, new Tag(parts[2], parts[5])];
    }
    public name: string;
    public value: string;
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}
