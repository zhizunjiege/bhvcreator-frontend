import { createRuleSet } from "./ruleset";
import { createManager } from "./manager";

export function createPlugins() {
  return [createRuleSet(), createManager()];
}
