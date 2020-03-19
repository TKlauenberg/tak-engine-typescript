import { ParsingError } from "./Errors";
import { Game, GameOptions } from "./Game";
import { grammar, requiredTags } from "./grammar";
import { Result } from "./interfaces";
import { Action, parse as parseMove } from "./Move";
import { Tag } from "./Tag";

export function parse(text: string): Result<Game> {
    const file = grammar.ptnGrouped.exec(text);
    if (!file) { return [false, new Error("not a valid PTN file")]; }
    const headerText = file[1];
    const body = file[3];

    const tags: Tag[] = [];
    let headerLine = grammar.tag.exec(headerText)!;
    while (headerLine !== null) {
        const [result, tag] = Tag.parse(headerLine[0]);
        if (result) {
            tags.push(tag as Tag);
            headerLine = grammar.tag.exec(headerText)!;
        } else {
            return [false, tag as ParsingError];
        }
    }
    const missingTags = requiredTags.filter((x) => !tags.some((y) => x === y.key));
    if (missingTags.length > 0) {
        return [false, new Error(`Some Tags are missing: ${missingTags.join(", ")}`)];
    }
    const tagUniqueNames = new Set(tags.map((x) => x.key));
    if (tagUniqueNames.size !== tags.length) {
        return [false, new Error(`duplicate tag entries`)];
    }
    const tagMap = tags.reduce((current, next) => {
        current.set(next.key, next);
        return current;
    }, new Map<string, Tag>());
    const gameOptions: GameOptions = {
        size: parseInt(tagMap.get("size")!.value),
    };
    tagMap.delete("size");
    const gameOptionsTags = ["player1", "player2", "tps"] as const;
    for (const tag of gameOptionsTags) {
        if (tagMap.has(tag)) {
            gameOptions[tag] = tagMap.get(tag)!.value;
            tagMap.delete(tag);
        }
    }
    let game: Game;
    try {
        game = new Game(gameOptions);
    } catch (err) {
        return [false, err];
    }
    // todo parse comments
    // parse Moves
    if (body) {
        let moveLines: RegExpMatchArray | undefined = grammar.moveGrouped.exec(body)!;
        let line = game.moveCount;
        const moves: Action[] = [];
        // if we have a tps string, it could be that we have only one move in the first
        if (moveLines[1] !== "" && moveLines[5] === "") {
            const currentLine = Number.parseInt(moveLines[1].trim()[0]);
            if (line !== currentLine) {
                return [false, new Error(`Expected Line ${line} but found ${currentLine}`)];
            }
            const [parseSuccess, move] = parseMove(moveLines[3].trim());
            if (parseSuccess) {
                moves.push(move as Action);
            } else {
                return [false, move as Error];
            }
            moveLines = moveLines[10] ? grammar.moveGrouped.exec(moveLines[10])! : undefined;
        }
        while (moveLines !== undefined) {
            const currentLine = Number.parseInt(moveLines[1].trim()[0]);
            if (line !== currentLine) {
                return [false, new Error(`Expected Line ${line} but found ${currentLine}`)];
            }
            const [firstParseSuccess, firstMove] = parseMove(moveLines[3].trim());
            if (firstParseSuccess) {
                moves.push(firstMove as Action);
            } else {
                return [false, firstMove as Error];
            }
            const [seccondParseSuccess, seccondMove] = parseMove(moveLines[5].trim());
            if (seccondParseSuccess) {
                moves.push(seccondMove as Action);
            } else {
                return [false, seccondMove as Error];
            }
            moveLines = moveLines[10] ? grammar.moveGrouped.exec(moveLines[10])! : undefined;
            line++;
        }
        for (const move of moves) {
            game.execute(move);
        }
    }
    return [true, game];
}
