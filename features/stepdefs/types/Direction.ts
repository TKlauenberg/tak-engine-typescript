import { defineParameterType, Transform } from "cucumber";
import { Direction } from "../../../lib";

const direction: Transform = {
    name: "direction",
    regexp: /((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/,
    transformer: (x) => {
        const match = x.match(/((?:up)|(?:\+)|(?:↑))|((?:down)|(?:-)|(?:↓))|((?:right)|(?:>)|(?:→))|((?:left)|(?:<)|(?:←))/)!;
        if (match[1] !== undefined) {
            return Direction.Up;
        } else if (match[2] !== undefined) {
            return Direction.Down;
        } else if (match[3] !== undefined) {
            return Direction.Right;
        } else {
            return Direction.Left;
        }
    },
};
defineParameterType(direction);
