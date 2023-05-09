import { createRuleSet } from "./ruleset";
import { createConvert } from "./convert";
import { createManager } from "./manager";

export function createPlugins() {
  return [createRuleSet(), createConvert(), createManager()];
}
