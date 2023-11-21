import { OptimizeChildPlugin } from "../core";
import { CQSIMOptimizeOptions, CQSIMOptimizePlugin } from "./cqsim";

export interface OptimizeOptions {
  CQSIM: CQSIMOptimizeOptions;
}

export function createChildPlugins(): OptimizeChildPlugin[] {
  return [new CQSIMOptimizePlugin()];
}
