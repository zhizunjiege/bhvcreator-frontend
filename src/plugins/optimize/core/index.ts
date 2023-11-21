export interface OptimizeChildPlugin {
  name: string;
  version: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result(ruleset: string, options: object): any;
}
