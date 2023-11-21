import { Core, Plugin, useCore } from "~/core";
import { useConvert } from "~/plugins/convert";
import { ExportOptions } from "~/plugins/convert/plugins";
import { OptimizeOptions, createChildPlugins } from "./plugins";

const PLUGIN_NAME = "optimize";
const PLUGIN_VER = "1.0.0";
const PLUGIN_DESC = "规则优化插件";

class OptimizePlugin implements Plugin {
  public name = PLUGIN_NAME;
  public version = PLUGIN_VER;
  public description = PLUGIN_DESC;

  public menu = { label: "规则优化", to: "" };

  private plugins = createChildPlugins();

  public async result<T extends keyof ExportOptions & keyof OptimizeOptions>(
    ruleset: string,
    target: T,
    options: OptimizeOptions[T],
    convert: ExportOptions[T]
  ) {
    const convertPlugin = useConvert();
    ruleset = convertPlugin.export_(ruleset, target, convert);
    for (const plugin of this.plugins) {
      if (plugin.name === target) {
        return plugin.result(ruleset, options);
      }
    }
  }
}

export function createOptimize() {
  const plugin = new OptimizePlugin();
  return {
    install(core: Core) {
      core.provide(PLUGIN_NAME, plugin);
    },
  };
}

export function useOptimize() {
  const core = useCore();
  return core.inject(PLUGIN_NAME) as OptimizePlugin;
}
