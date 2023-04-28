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
  expressions: string[];
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
export interface MetaParam extends Parameter {
  desc: string;
  value: string;
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
      args: string;
    }[];
  };
}
export interface SubSet {
  id: string;
  name: string;
  desc: string;
  condition: Condition;
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

type XmlParameter = {
  "@name": string;
  "@type": string;
};
type XmlCondition = {
  "@join": "and" | "or";
  Expression: string[];
};
type XmlTypeDefine = {
  "@type": string;
  Variable: XmlParameter[];
};
type XmlFuncDefine = {
  "@type": string;
  Symbol: string;
  Params: {
    Param: XmlParameter[];
  };
  Return: {
    "@type": string;
    Value: string;
  };
};
type XmlMetaParam = {
  "@name": string;
  "@type": string;
  "@desc": string;
  Value: string;
};
type XmlRule = {
  "@id": string;
  "@name": string;
  "@desc": string;
  Condition: XmlCondition;
  Consequence: {
    Assignment: {
      Target: string;
      Value: string;
    }[];
    ArrayOperation: {
      Target: string;
      Operation: string;
      Args: string;
    }[];
  };
};
type XmlSubSet = {
  "@id": string;
  "@name": string;
  "@desc": string;
  Condition: XmlCondition;
  SubSets: {
    SubSet: XmlSubSet[];
  };
  Rules: {
    Rule: XmlRule[];
  };
};

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
    "Expression",
    "Assignment",
    "ArrayOperation",
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
  private buildCondition(condition: Condition): XmlCondition {
    return {
      "@join": condition.join,
      Expression: condition.expressions,
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
  private buildMetaParam(param: MetaParam): XmlMetaParam {
    return {
      "@name": param.name,
      "@type": param.type,
      "@desc": param.desc,
      Value: param.value,
    };
  }
  private buildRule(rule: Rule): XmlRule {
    return {
      "@id": rule.id,
      "@name": rule.name,
      "@desc": rule.desc,
      Condition: this.buildCondition(rule.condition),
      Consequence: {
        Assignment: rule.consequence.assignments.map((item) => ({
          Target: item.target,
          Value: item.value,
        })),
        ArrayOperation: rule.consequence.operations.map((item) => ({
          Target: item.target,
          Operation: item.operation,
          Args: item.args,
        })),
      },
    };
  }
  private buildSubSet(subSet: SubSet): XmlSubSet {
    return {
      "@id": subSet.id,
      "@name": subSet.name,
      "@desc": subSet.desc,
      Condition: this.buildCondition(subSet.condition),
      SubSets: {
        SubSet: subSet.subSets.map(this.buildSubSet.bind(this)),
      },
      Rules: {
        Rule: subSet.rules.map(this.buildRule.bind(this)),
      },
    };
  }
  public buildRuleSet(ruleset: RuleSet): string {
    const tmp = {
      "?xml": { "@version": "1.0", "@encoding": "UTF-8" },
      RuleSet: {
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
            Output: ruleset.metaInfo.outputs.map(
              this.buildMetaParam.bind(this)
            ),
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
      },
    };
    return this.builder.build(tmp);
  }

  private parseParameter(param: XmlParameter): Parameter {
    return {
      name: param["@name"],
      type: param["@type"],
    };
  }
  private parseCondition(condition: XmlCondition): Condition {
    return {
      join: condition["@join"],
      expressions: condition.Expression,
    };
  }
  private parseTypeDefine(typeDefine: XmlTypeDefine): TypeDefine {
    return {
      type: typeDefine["@type"],
      variables: typeDefine.Variable.map(this.parseParameter.bind(this)),
    };
  }
  private parseFuncDefine(funcDefine: XmlFuncDefine): FuncDefine {
    return {
      type: funcDefine["@type"],
      symbol: funcDefine.Symbol,
      params: funcDefine.Params.Param.map(this.parseParameter.bind(this)),
      return: {
        type: funcDefine.Return["@type"],
        value: funcDefine.Return.Value,
      },
    };
  }
  private parseMetaParam(param: XmlMetaParam): MetaParam {
    return {
      name: param["@name"],
      type: param["@type"],
      desc: param["@desc"],
      value: param.Value,
    };
  }
  private parseRule(rule: XmlRule): Rule {
    return {
      id: rule["@id"],
      name: rule["@name"],
      desc: rule["@desc"],
      condition: this.parseCondition(rule.Condition),
      consequence: {
        assignments: rule.Consequence.Assignment.map((item) => ({
          target: item.Target,
          value: item.Value,
        })),
        operations:
          rule.Consequence.ArrayOperation?.map((item) => ({
            target: item.Target,
            operation: item.Operation,
            args: item.Args,
          })) ?? [],
      },
    };
  }
  private parseSubSet(subSet: XmlSubSet): SubSet {
    return {
      id: subSet["@id"],
      name: subSet["@name"],
      desc: subSet["@desc"],
      condition: this.parseCondition(subSet.Condition),
      subSets: subSet.SubSets.SubSet?.map(this.parseSubSet.bind(this)) ?? [],
      rules: subSet.Rules.Rule.map(this.parseRule.bind(this)),
    };
  }
  public parseRuleSet(ruleset: string): RuleSet {
    const tmp = this.parser.parse(ruleset);
    return {
      typeDefines: tmp.RuleSet.TypeDefines.TypeDefine.map(
        this.parseTypeDefine.bind(this)
      ),
      funcDefines: tmp.RuleSet.FuncDefines.FuncDefine.map(
        this.parseFuncDefine.bind(this)
      ),
      metaInfo: {
        inputs: tmp.RuleSet.MetaInfo.Inputs.Input.map(
          this.parseMetaParam.bind(this)
        ),
        outputs: tmp.RuleSet.MetaInfo.Outputs.Output.map(
          this.parseMetaParam.bind(this)
        ),
        caches: tmp.RuleSet.MetaInfo.Caches.Cache.map(
          this.parseMetaParam.bind(this)
        ),
        consts: tmp.RuleSet.MetaInfo.Consts.Const.map(
          this.parseMetaParam.bind(this)
        ),
        temps: tmp.RuleSet.MetaInfo.Temps.Temp.map(
          this.parseMetaParam.bind(this)
        ),
      },
      subSets: tmp.RuleSet.SubSets.SubSet.map(this.parseSubSet.bind(this)),
      rules: tmp.RuleSet.Rules.Rule.map(this.parseRule.bind(this)),
    };
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
