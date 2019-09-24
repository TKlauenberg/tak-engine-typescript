import { defineParameterType, Transform } from "cucumber";
const Position: Transform = {
    name: "pos",
    regexp: /[a-h][1-8]/,
    transformer: (x) => x,
};
defineParameterType(Position);
