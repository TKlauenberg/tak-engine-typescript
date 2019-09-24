// With only small changes this grammer is from PTN Ninja by Craig Laparo
// which is licensed under a Creative Commons
// Attribution-NonCommercial-ShareAlike 4.0 International License.
// http://creativecommons.org/licenses/by-nc-sa/4.0/
const requiredTagsRegExp = {
    size: /^([3-9])$/,
} as const;

const otherTagsRegExp = {
    player1: /^(.*)$/,
    player2: /^(.*)$/,
    date: /^(\d\d\d\d)\.(\d\d?)\.(\d\d?)$/,
    result: /^(R-0|0-R|F-0|0-F|1-0|0-1|1\/2-1\/2|)$/,
    event: /^.*$/,
    site: /^.*$/,
    round: /^\d+$/,
    rating1: /^\d+$/,
    rating2: /^\d+$/,
    tps: /^[1-8xSC\/,]+\s+[1,2]\s+\d+$/,
    points: /^\d+$/,
    time: /^\d\d(:\d\d){1,2}$/,
    clock: /^\d+min(\+\d+sec)$|^((((\d\s+)?\d\d?:)?\d\d?:)?\d\d?\s*)?(\+(((\d\s+)?\d\d?:)?\d\d?:)?\d\d?)?$/,
} as const;
export const requiredTags: Array<keyof typeof requiredTagsRegExp> = Object.keys(requiredTagsRegExp) as Array<keyof typeof requiredTagsRegExp>;
export const otherTags: Array<keyof typeof otherTagsRegExp> = Object.keys(otherTagsRegExp) as Array<keyof typeof otherTagsRegExp>;
export const tags = Object.assign({}, requiredTagsRegExp, otherTagsRegExp);
const space = `(?:x[1-8]?)`;
const stack = `(?:[12]+[SC]?)`;
const stackGrouped = `([12]*)([12][SC]?)`;
const separator = `[,\\/]`;
const col = `(?:${space}|${stack})`;
const cols = `(${col}?${separator}?)`;
const colGrouped = `(${space}?)(${stack}?)(${separator}?)`;
const tpsGrouped = `((?:${col}|${separator})*)(?:(\\s+)([12]))?(?:(\\s+)([1-8]\\d*))?([^]*)`;
const tag = `(?:[^\\[]*\\[.*\\]?)`;
const tagGrouped = `([^\\[]*\\[\\s*?)(\\S+)(\\s*)([\'"]?)([^\\4]*)(\\4)([^]*\\]?)`;
const stone = `[FSC]?`;
const square = `[a-i][1-8]`;
const count = `[1-8]?`;
const direction = `(?:[-+<>])`;
const drops = `[1-8]*`;
const place = `(?:${stone}${square})`;
const placeGrouped = `(${stone})(${square})`;
const slide = `(?:${count}${square}${direction}${drops}${stone})`;
const slideGrouped = `(${count})(${square})(${direction})(${drops})(${stone})`;
const comment = `(?:\\s*?\\{[^}]*\\}?)*`;
const commentText = `\\s*\\{\\s*[^}]*[^}\\s]?\\s*\\}?`;
const commentGrouped = `(\\s*\\{\\s*)([^}]*[^}\\s])?(\\s*\\}?)`;
const result = `(?:(?:\\s|--)*(?:R-0|0-R|F-0|0-F|1-0|0-1|1\\/2-1\\/2))`;
const resultGrouped = `((?:\\s|--)*)(R-0|0-R|F-0|0-F|1-0|0-1|1\\/2-1\\/2)`;
const evaluation = `[?!\'"]*`;
const nop = `(?:\\s*(?:load|--|\\.\\.\\.))`;
const nopGrouped = `(\\s*)(\\S+)`;
const ply = `(?:\\s*(?:${slide}|${place})${evaluation})`;
const plyGrouped = `(\\s*)(?:(${slide})|(${place}))(${evaluation})`;
const linenum = `(?:^|\\s)+(?:\\d+(?:-\\d*)?\\.+)+`;
const linenumGrouped = `(^|\\s+)((?:\\d+(?:-\\d*)?\\.+)+)`;
const move = `(?:${linenum}${comment}(?:${nop}|${ply})?${comment}${ply}?${comment}${result}?${comment}[ \\t]*[^]*)`;
const moveGrouped = `^(${linenum})(${comment})(${nop}|${ply}?)(${comment})(${ply}?)(${comment})(${result}?)(${comment})(\\s*)([^]*)`;
const moveOnly = `^${move}$`;
const ptnGrouped = `^(${tag}+)(${comment})((?:.|\\s)*?)((?:\\s|--)*)$`;
export const grammar = {
    space: new RegExp(space, "g"),
    stack: new RegExp(stack, "g"),
    stack_grouped: new RegExp(stackGrouped, ""),
    separator: new RegExp(separator, "g"),
    col: new RegExp(col, "g"),
    cols: new RegExp(cols, "g"),
    col_grouped: new RegExp(colGrouped, ""),
    tps_grouped: new RegExp(tpsGrouped, ""),
    tag: new RegExp(tag, "g"),
    tag_grouped: new RegExp(tagGrouped, ""),
    stone: new RegExp(stone, "g"),
    square: new RegExp(square, "g"),
    count: new RegExp(count, "g"),
    direction: new RegExp(direction, "g"),
    drops: new RegExp(drops, "g"),
    place: new RegExp(place, "g"),
    place_grouped: new RegExp(placeGrouped, ""),
    slide: new RegExp(slide, "g"),
    slide_grouped: new RegExp(slideGrouped, ""),
    comment: new RegExp(comment, "g"),
    comment_text: new RegExp(commentText, "g"),
    comment_grouped: new RegExp(commentGrouped, ""),
    result: new RegExp(result, "g"),
    result_grouped: new RegExp(resultGrouped, ""),
    evaluation: new RegExp(evaluation, "g"),
    nop: new RegExp(nop, "g"),
    nop_grouped: new RegExp(nopGrouped, ""),
    ply: new RegExp(ply, "g"),
    ply_grouped: new RegExp(plyGrouped, ""),
    linenum: new RegExp(linenum, "g"),
    linenum_grouped: new RegExp(linenumGrouped, ""),
    move: new RegExp(move, "g"),
    move_grouped: new RegExp(moveGrouped, ""),
    move_only: new RegExp(moveOnly, ""),
    ptn_grouped: new RegExp(ptnGrouped, ""),
};
