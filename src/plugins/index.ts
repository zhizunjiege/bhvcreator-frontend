import { createEditor } from "./editor";

export function createPlugins() {
  return [createEditor()];
}
