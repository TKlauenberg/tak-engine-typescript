/**
 * generate a range with iterable
 * @param start starting value
 * @param end end value
 */
export function* range(start: number, end: number): Iterable<number> {
    yield start;
    if (start === end) {
        return;
    }
    yield* range(start + 1, end);
}
