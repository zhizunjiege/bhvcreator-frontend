export function combine<T>(factors: T[], size: number): T[][] {
  const result: T[][] = [];
  const dfs = (index: number, path: T[]) => {
    if (path.length === size) {
      result.push(path);
      return;
    }
    if (index === factors.length) {
      return;
    }
    dfs(index + 1, [...path, factors[index]]);
    dfs(index + 1, path);
  };
  dfs(0, []);
  return result;
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function lhdesign(
  factors: { lower: number; upper: number }[],
  size: number
): number[][] {
  const result: number[][] = [];
  const base: number[] = [];
  for (let k = 0; k < size; k++) {
    base.push(k / size);
    result.push([]);
  }
  for (let i = 0; i < factors.length; i++) {
    const shuf = shuffle(base);
    for (let j = 0; j < size; j++) {
      let x = shuf[j] + Math.random() / size;
      x = factors[i].lower + x * (factors[i].upper - factors[i].lower);
      result[j].push(x);
    }
  }
  return result;
}
