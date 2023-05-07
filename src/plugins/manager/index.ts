import { Core, Plugin, useCore } from "~/core";

const PLUGIN_NAME = "manager";
const PLUGIN_VER = "1.0.0";
const PLUGIN_DESC = "资源管理插件";

class ManagerPlugin implements Plugin {
  public name = PLUGIN_NAME;
  public version = PLUGIN_VER;
  public description = PLUGIN_DESC;

  public menu = { label: "资源管理", to: "" };
}

export function createManager() {
  const manager = new ManagerPlugin();
  return {
    install(core: Core) {
      core.provide(PLUGIN_NAME, manager);
    },
  };
}

export function useManager() {
  const core = useCore();
  return core.inject(PLUGIN_NAME) as ManagerPlugin;
}
