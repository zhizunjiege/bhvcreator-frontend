import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { Core, Plugin, useCore } from "~/core";

const PLUGIN_NAME = "ruleset";
const PLUGIN_VER = "1.0.0";
const PLUGIN_DESC = "规则录入插件";

export interface Parameter {
  name: string;
  type: string;
}
export interface MetaParam extends Parameter {
  desc: string;
  value: string;
}
export interface Condition {
  expression: string;
}
export interface Consequence {
  operations: {
    target: string;
    method: string;
    value: string;
  }[];
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
    value: string;
  };
}
export interface Rule {
  id: string;
  name: string;
  desc: string;
  condition: Condition;
  consequence: Consequence;
}
export interface SubSet {
  id: string;
  name: string;
  desc: string;
  activation: string;
  subSets: SubSet[];
  rules: Rule[];
}
export interface RuleSet {
  typeDefines: TypeDefine[];
  funcDefines: FuncDefine[];
  metaInfo: {
    inputs: MetaParam[];
    outputs: MetaParam[];
    caches: MetaParam[];
    consts: MetaParam[];
    temps: MetaParam[];
  };
  subSets: SubSet[];
  rules: Rule[];
}

interface XmlParameter {
  "@name": string;
  "@type": string;
}
interface XmlMetaParam extends XmlParameter {
  "@desc": string;
  Value: string;
}
interface XmlCondition {
  Expression?: string;
}
interface XmlConsequence {
  Operation?: {
    Target: string;
    Method: string;
    Value: string;
  }[];
}
interface XmlTypeDefine {
  "@type": string;
  Variable?: XmlParameter[];
}
interface XmlFuncDefine {
  "@type": string;
  Symbol: string;
  Params: {
    Param?: XmlParameter[];
  };
  Return: {
    "@type": string;
    Value: string;
  };
}
interface XmlRule {
  "@id": string;
  "@name": string;
  "@desc": string;
  Condition: XmlCondition;
  Consequence: XmlConsequence;
}
interface XmlSubSet {
  "@id": string;
  "@name": string;
  "@desc": string;
  Activation: string;
  SubSets: {
    SubSet?: XmlSubSet[];
  };
  Rules: {
    Rule?: XmlRule[];
  };
}
interface XmlRuleSet {
  TypeDefines: {
    TypeDefine?: XmlTypeDefine[];
  };
  FuncDefines: {
    FuncDefine?: XmlFuncDefine[];
  };
  MetaInfo: {
    Inputs: {
      Input?: XmlMetaParam[];
    };
    Outputs: {
      Output?: XmlMetaParam[];
    };
    Caches: {
      Cache?: XmlMetaParam[];
    };
    Consts: {
      Const?: XmlMetaParam[];
    };
    Temps: {
      Temp?: XmlMetaParam[];
    };
  };
  SubSets: {
    SubSet?: XmlSubSet[];
  };
  Rules: {
    Rule?: XmlRule[];
  };
}

class RuleSetPlugin implements Plugin {
  public name = PLUGIN_NAME;
  public version = PLUGIN_VER;
  public description = PLUGIN_DESC;

  public menu = { label: "规则录入", to: "" };

  private arrayNames = [
    "TypeDefine",
    "Variable",
    "FuncDefine",
    "Param",
    "Const",
    "Input",
    "Output",
    "Cache",
    "Temp",
    "SubSet",
    "Rule",
    "Operation",
  ];
  private builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    suppressEmptyNode: true,
    format: true,
  });
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false,
    isArray: (name) => this.arrayNames.includes(name),
  });

  private buildParameter(param: Parameter): XmlParameter {
    return {
      "@name": param.name,
      "@type": param.type,
    };
  }
  private buildMetaParam(param: MetaParam): XmlMetaParam {
    return {
      ...this.buildParameter(param),
      "@desc": param.desc,
      Value: param.value,
    };
  }
  private buildCondition(condition: Condition): XmlCondition {
    return {
      Expression: condition.expression,
    };
  }
  private buildConsequence(consequence: Consequence): XmlConsequence {
    return {
      Operation: consequence.operations.map((item) => ({
        Target: item.target,
        Method: item.method,
        Value: item.value,
      })),
    };
  }
  private buildTypeDefine(typeDefine: TypeDefine): XmlTypeDefine {
    return {
      "@type": typeDefine.type,
      Variable: typeDefine.variables.map(this.buildParameter.bind(this)),
    };
  }
  private buildFuncDefine(funcDefine: FuncDefine): XmlFuncDefine {
    return {
      "@type": funcDefine.type,
      Symbol: funcDefine.symbol,
      Params: {
        Param: funcDefine.params.map(this.buildParameter.bind(this)),
      },
      Return: {
        "@type": funcDefine.return.type,
        Value: funcDefine.return.value,
      },
    };
  }
  private buildRule(rule: Rule): XmlRule {
    return {
      "@id": rule.id,
      "@name": rule.name,
      "@desc": rule.desc,
      Condition: this.buildCondition(rule.condition),
      Consequence: this.buildConsequence(rule.consequence),
    };
  }
  private buildSubSet(subSet: SubSet): XmlSubSet {
    return {
      "@id": subSet.id,
      "@name": subSet.name,
      "@desc": subSet.desc,
      Activation: subSet.activation,
      SubSets: {
        SubSet: subSet.subSets.map(this.buildSubSet.bind(this)),
      },
      Rules: {
        Rule: subSet.rules.map(this.buildRule.bind(this)),
      },
    };
  }
  private buildRuleSet(ruleset: RuleSet): XmlRuleSet {
    return {
      TypeDefines: {
        TypeDefine: ruleset.typeDefines.map(this.buildTypeDefine.bind(this)),
      },
      FuncDefines: {
        FuncDefine: ruleset.funcDefines.map(this.buildFuncDefine.bind(this)),
      },
      MetaInfo: {
        Inputs: {
          Input: ruleset.metaInfo.inputs.map(this.buildMetaParam.bind(this)),
        },
        Outputs: {
          Output: ruleset.metaInfo.outputs.map(this.buildMetaParam.bind(this)),
        },
        Caches: {
          Cache: ruleset.metaInfo.caches.map(this.buildMetaParam.bind(this)),
        },
        Consts: {
          Const: ruleset.metaInfo.consts.map(this.buildMetaParam.bind(this)),
        },
        Temps: {
          Temp: ruleset.metaInfo.temps.map(this.buildMetaParam.bind(this)),
        },
      },
      SubSets: {
        SubSet: ruleset.subSets.map(this.buildSubSet.bind(this)),
      },
      Rules: {
        Rule: ruleset.rules.map(this.buildRule.bind(this)),
      },
    };
  }
  public buildRaw(ruleset: XmlRuleSet): string {
    return this.builder.build({
      "?xml": { "@version": "1.0", "@encoding": "UTF-8" },
      RuleSet: ruleset,
    });
  }
  public build(ruleset: RuleSet): string {
    return this.buildRaw(this.buildRuleSet(ruleset));
  }

  private parseParameter(param: XmlParameter): Parameter {
    return {
      name: param["@name"],
      type: param["@type"],
    };
  }
  private parseMetaParam(param: XmlMetaParam): MetaParam {
    return {
      ...this.parseParameter(param),
      desc: param["@desc"],
      value: param.Value,
    };
  }
  private parseCondition(condition: XmlCondition): Condition {
    return {
      expression: condition.Expression ?? "",
    };
  }
  private parseConsequence(consequence: XmlConsequence): Consequence {
    return {
      operations:
        consequence.Operation?.map((item) => ({
          target: item.Target,
          method: item.Method,
          value: item.Value,
        })) ?? [],
    };
  }
  private parseTypeDefine(typeDefine: XmlTypeDefine): TypeDefine {
    return {
      type: typeDefine["@type"],
      variables: typeDefine.Variable?.map(this.parseParameter) ?? [],
    };
  }
  private parseFuncDefine(funcDefine: XmlFuncDefine): FuncDefine {
    return {
      type: funcDefine["@type"],
      symbol: funcDefine.Symbol,
      params: funcDefine.Params.Param?.map(this.parseParameter) ?? [],
      return: {
        type: funcDefine.Return["@type"],
        value: funcDefine.Return.Value,
      },
    };
  }
  private parseRule(rule: XmlRule): Rule {
    return {
      id: rule["@id"],
      name: rule["@name"],
      desc: rule["@desc"],
      condition: this.parseCondition(rule.Condition),
      consequence: this.parseConsequence(rule.Consequence),
    };
  }
  private parseSubSet(subSet: XmlSubSet): SubSet {
    return {
      id: subSet["@id"],
      name: subSet["@name"],
      desc: subSet["@desc"],
      activation: subSet.Activation,
      subSets: subSet.SubSets.SubSet?.map(this.parseSubSet.bind(this)) ?? [],
      rules: subSet.Rules.Rule?.map(this.parseRule.bind(this)) ?? [],
    };
  }
  private parseRuleSet(ruleset: XmlRuleSet): RuleSet {
    return {
      typeDefines:
        ruleset.TypeDefines.TypeDefine?.map(this.parseTypeDefine.bind(this)) ??
        [],
      funcDefines:
        ruleset.FuncDefines.FuncDefine?.map(this.parseFuncDefine.bind(this)) ??
        [],
      metaInfo: {
        inputs:
          ruleset.MetaInfo.Inputs.Input?.map(this.parseMetaParam.bind(this)) ??
          [],
        outputs:
          ruleset.MetaInfo.Outputs.Output?.map(
            this.parseMetaParam.bind(this)
          ) ?? [],
        caches:
          ruleset.MetaInfo.Caches.Cache?.map(this.parseMetaParam.bind(this)) ??
          [],
        consts:
          ruleset.MetaInfo.Consts.Const?.map(this.parseMetaParam.bind(this)) ??
          [],
        temps:
          ruleset.MetaInfo.Temps.Temp?.map(this.parseMetaParam.bind(this)) ??
          [],
      },
      subSets: ruleset.SubSets.SubSet?.map(this.parseSubSet.bind(this)) ?? [],
      rules: ruleset.Rules.Rule?.map(this.parseRule.bind(this)) ?? [],
    };
  }
  public parseRaw(xml: string): XmlRuleSet {
    return this.parser.parse(xml).RuleSet;
  }
  public parse(xml: string): RuleSet {
    return this.parseRuleSet(this.parseRaw(xml));
  }
}

export function createRuleSet() {
  const ruleset = new RuleSetPlugin();
  return {
    install(core: Core) {
      core.provide(PLUGIN_NAME, ruleset);
    },
  };
}

export function useRuleSet() {
  const core = useCore();
  return core.inject(PLUGIN_NAME) as RuleSetPlugin;
}
