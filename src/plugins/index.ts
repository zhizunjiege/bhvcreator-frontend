import { createRuleset } from "./ruleset";

export function createPlugins() {
  return [createRuleset()];
}
