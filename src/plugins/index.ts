import { createRuleSet } from "./ruleset";
import { createConvert } from "./convert";
import { createOptimize } from "./optimize";
import { createManager } from "./manager";

export function createPlugins() {
  return [createRuleSet(), createConvert(), createOptimize(), createManager()];
}
