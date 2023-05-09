import { Core, Plugin, useCore } from "~/core";
import { useRuleSet } from "~/plugins/ruleset";
import { ExportOptions, ImportOptions, createChildPlugins } from "./plugins";

const PLUGIN_NAME = "convert";
const PLUGIN_VER = "1.0.0";
const PLUGIN_DESC = "导入导出插件";

class ConvertPlugin implements Plugin {
  public name = PLUGIN_NAME;
  public version = PLUGIN_VER;
  public description = PLUGIN_DESC;

  public menu = {
    label: "导入导出",
    to: "",
    items: [
      {
        label: "导入模型...",
        to: "import",
      },
    ],
  };

  private plugins = createChildPlugins();

  public export_<T extends keyof ExportOptions>(
    ruleset: string,
    target: T,
    options: ExportOptions[T]
  ): string {
    const rulesetPlugin = useRuleSet();
    for (const plugin of this.plugins) {
      if (plugin.name === target) {
        return plugin.export_(rulesetPlugin.parse(ruleset), options);
      }
    }
    throw new Error(`不支持的导出目标: ${target}`);
  }

  public import_<T extends keyof ImportOptions>(
    content: string,
    target: T,
    options: ImportOptions[T]
  ): string {
    const rulesetPlugin = useRuleSet();
    for (const plugin of this.plugins) {
      if (plugin.name === target) {
        return rulesetPlugin.build(plugin.import_(content, options));
      }
    }
    throw new Error(`不支持的导入目标: ${target}`);
  }
}

export function createConvert() {
  const plugin = new ConvertPlugin();
  return {
    install(core: Core) {
      core.provide(PLUGIN_NAME, plugin);
    },
  };
}

export function useConvert() {
  const core = useCore();
  return core.inject(PLUGIN_NAME) as ConvertPlugin;
}
