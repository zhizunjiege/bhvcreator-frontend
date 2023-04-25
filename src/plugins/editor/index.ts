import { Core, Plugin, useCore } from "~/core";

class EditorPlugin implements Plugin {
  public name = "editor";
  public version = "1.0.0";
  public description = "规则录入插件";

  public menu = { label: "规则录入", to: "" };
}

export function createEditor() {
  const editor = new EditorPlugin();
  return {
    install(core: Core) {
      core.provide("editor", editor);
    },
  };
}

export function useEditor() {
  const core = useCore();
  return core.inject("editor") as EditorPlugin;
}
