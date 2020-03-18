import { defineParameterType, Transform } from "cucumber";
import { Player } from "../../../lib/Player";

export function getPlayerByColor(color: string) {
    return color === "white" ? Player.One : Player.Two;
}

export function getPlayerByNumber(playerNumber: number | string) {
    const x = typeof playerNumber === "string" ? parseInt(playerNumber) : playerNumber;
    switch (x) {
        case 1: return Player.One;
        case 2: return Player.Two;
    }
}
const playerColor: Transform = {
    name: "playerByColor",
    regexp: /(black)|(white)/,
    transformer: getPlayerByColor,
};
defineParameterType(playerColor);

const player: Transform = {
    name: "player",
    regexp: /[pP]layer [12]/,
    transformer: (x) => {
        const playerNumber = x.match(/[pP]layer ([12])/)![1];
        return getPlayerByNumber(playerNumber);
    },
};
defineParameterType(player);
