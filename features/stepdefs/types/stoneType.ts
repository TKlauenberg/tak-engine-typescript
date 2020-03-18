import { defineParameterType, Transform } from "cucumber";
import { parseStoneType, StoneType } from "../../../lib/Stone";
const stoneType: Transform = {
    name: "stoneType",
    regexp: /[FSC]/,
    transformer: (x) => {
        const [parseResult, type] = parseStoneType(x);
        if (parseResult) {
            return type;
        } else {
            throw Error;
        }
    },
};
defineParameterType(stoneType);
const stoneTypeByName: Transform = {
    name: "stoneTypeByName",
    regexp: /(flat stone)|(capstone)|(standing stone)/,
    transformer: (x) => {
        const match = x.match(/(flat stone)|(capstone)|(standing stone)/)!;
        if (match[1]) {
            return StoneType.FLAT;
        } else if (match[2]) {
            return StoneType.CAP;
        } else {
            return StoneType.STANDING;
        }
    },
};
defineParameterType(stoneTypeByName);
