import { App } from "vue";

import * as monaco from "monaco-editor";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

import MonacoEditor from "./components/monaco-editor.vue";
import ruleexpr from "./languages/ruleexpr";
import ThemeLight from "./themes/light";
import ThemeDark from "./themes/dark";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "html" || label === "xml") {
      return new htmlWorker();
    } else if (label === "javascript") {
      return new jsWorker();
    }
    return new editorWorker();
  },
};

monaco.languages.register({ id: "ruleexpr" });
monaco.languages.setMonarchTokensProvider(
  "ruleexpr",
  ruleexpr as monaco.languages.IMonarchLanguage
);

monaco.editor.defineTheme("light", ThemeLight);
monaco.editor.defineTheme("dark", ThemeDark);

// editor plugin
export function createEditor() {
  return markRaw({
    install(app: App) {
      app.component("MonacoEditor", MonacoEditor);
    },
  });
}
