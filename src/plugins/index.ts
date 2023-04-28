import { createRuleSet } from "./ruleset";

export function createPlugins() {
  return [createRuleSet()];
}
