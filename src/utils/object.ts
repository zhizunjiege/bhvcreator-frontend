export function isEmpty(obj: object) {
  return (
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

export function deepCopy<T>(src: T): T {
  return JSON.parse(JSON.stringify(src));
}

export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}