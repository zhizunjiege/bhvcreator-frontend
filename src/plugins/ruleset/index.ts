import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { Core, Plugin, useCore } from "~/core";

const PLUGIN_NAME = "ruleset";
const PLUGIN_VER = "1.0.0";
const PLUGIN_DESC = "规则录入插件";

export interface Parameter {
  name: string;
  type: string;
}
export interface Condition {
  join: "and" | "or";
  exprs: string[];
}
export interface TypeDefine {
  type: string;
  variables: Parameter[];
}
export interface FuncDefine {
  type: string;
  symbol: string;
  params: Parameter[];
  return: {
    type: string;
    expr: string;
  };
}
export interface MetaParam extends Parameter {
  desc: string;
  value?: string;
}
export interface Rule {
  id: string;
  name: string;
  desc: string;
  condition: Condition;
  consequence: {
    assignments: {
      target: string;
      value: string;
    }[];
    operations: {
      target: string;
      operation: string;
      args?: string;
    }[];
  };
}
export interface SubSet {
  id: string;
  name: string;
  desc: string;
  condition: Condition;
  subsets: SubSet[];
  rules: Rule[];
}
export interface RuleSet {
  typeDefines: TypeDefine[];
  funcDefines: FuncDefine[];
  metainfo: {
    consts: MetaParam[];
    inputs: MetaParam[];
    outputs: MetaParam[];
    caches: MetaParam[];
    temps: MetaParam[];
  };
  subsets: SubSet[];
  rules: Rule[];
}

class RulesetPlugin implements Plugin {
  public name = PLUGIN_NAME;
  public version = PLUGIN_VER;
  public description = PLUGIN_DESC;

  public menu = { label: "规则录入", to: "" };

  private builder = new XMLBuilder();
  private parser = new XMLParser();

  public Obj2Xml(obj: RuleSet): string {
    const xml = this.builder.build(obj);
    return xml;
  }

  public Xml2Obj(xml: string): RuleSet {
    const obj = this.parser.parse(xml);
    return obj;
  }
}

export function createRuleset() {
  const ruleset = new RulesetPlugin();
  return {
    install(core: Core) {
      core.provide(PLUGIN_NAME, ruleset);
    },
  };
}

export function useRuleset() {
  const core = useCore();
  return core.inject(PLUGIN_NAME) as RulesetPlugin;
}
