import * as monaco from "monaco-editor";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

import ruleexpr from "./languages/ruleexpr";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "html" || label === "xml") {
      return new htmlWorker();
    }
    return new editorWorker();
  },
};

monaco.languages.register({ id: ruleexpr.id });
monaco.languages.setMonarchTokensProvider(
  ruleexpr.id,
  ruleexpr.definition as monaco.languages.IMonarchLanguage
);

// editor plugin
export function createEditor() {
  return markRaw({
    install() {
      /* Empty */
    },
  });
}
