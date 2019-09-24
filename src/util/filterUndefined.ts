export function filterUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}
