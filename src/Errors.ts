export class ParsingError extends Error {
    constructor(message: string, public parsedType: string, public text: string) {
        super(message);
    }
}
