import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { randomString } from "~/utils";
import {
  Parameter,
  MetaParam,
  Condition,
  Consequence,
  TypeDefine,
  Rule,
  SubSet,
  RuleSet,
} from "~/plugins/ruleset";
import { ConvertChildPlugin } from "../../core";

interface CQSIMParameter {
  "@name": string;
  "@type": string;
}
interface CQSIMMetaParam extends CQSIMParameter {
  "#comment": string;
  InitValue?: string;
  Value?: {
    Expression: string;
  };
}
interface CQSIMCondition {
  Expression: string;
}
interface CQSIMConsequence {
  Operation?: {
    Target: string;
    Operation: string;
    Args: {
      Expression: string;
    };
  }[];
  Assignment?: {
    Target: string;
    Value: {
      Expression: string;
    };
  }[];
  ArrayOperation?: {
    Target: string;
    Operation: string;
    Args: {
      Expression: string;
    };
  }[];
}
interface CQSIMTypeDefine {
  "@type": string;
  Variable: CQSIMParameter[];
}
interface CQSIMRule {
  "#comment": string[];
  Condition: CQSIMCondition;
  Consequence: CQSIMConsequence;
}
interface CQSIMSubRuleSet {
  "#comment": string[];
  Rules: {
    Rule: CQSIMRule[];
  };
}
interface CQSIMRuleSet {
  "@version": string;
  TypeDefines: {
    TypeDefine: CQSIMTypeDefine[];
  };
  MetaInfo: {
    Inputs: {
      Param: CQSIMMetaParam[];
    };
    Outputs: {
      Param: CQSIMMetaParam[];
    };
    Caches: {
      Param: CQSIMMetaParam[];
    };
  };
  SubRuleSets: {
    SubRuleSet: CQSIMSubRuleSet[];
  };
}

export interface CQSIMExportOptions {
  reserved: never;
}

export interface CQSIMImportOptions {
  reserved: never;
}

export class CQSIMConvertPlugin implements ConvertChildPlugin {
  public name = "CQSIM";
  public version = "1.0";

  private arrayNames = [
    "TypeDefine",
    "Variable",
    "Param",
    "SubRuleSet",
    "Rule",
    "Operation",
    "Assignment",
    "ArrayOperation",
  ];
  private builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    commentPropName: "#comment",
    suppressEmptyNode: true,
    format: true,
  });
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    commentPropName: "#comment",
    parseTagValue: false,
    isArray: (name) => this.arrayNames.includes(name),
  });

  private exportParameter(param: Parameter): CQSIMParameter {
    return {
      "@name": param.name,
      "@type": param.type,
    };
  }
  private exportInitParam(param: MetaParam): CQSIMMetaParam {
    return {
      "#comment": param.desc,
      ...this.exportParameter(param),
      ...(param.value ? { InitValue: param.value } : {}),
    };
  }
  private exportTempParam(param: MetaParam): CQSIMMetaParam {
    return {
      "#comment": param.desc,
      ...this.exportParameter(param),
      Value: {
        Expression: param.value,
      },
    };
  }
  private exportCondition(condition: Condition): CQSIMCondition {
    return {
      Expression: condition.expression,
    };
  }
  private exportConsequence(consequence: Consequence): CQSIMConsequence {
    return {
      Operation: consequence.operations.map((o) => ({
        Target: o.target,
        Operation: o.method,
        Args: {
          Expression: o.value,
        },
      })),
    };
  }
  private exportTypeDefine(typeDefine: TypeDefine): CQSIMTypeDefine {
    return {
      "@type": typeDefine.type,
      Variable: typeDefine.variables.map(this.exportParameter),
    };
  }
  private exportRule(rule: Rule): CQSIMRule {
    return {
      "#comment": [rule.id, rule.name, rule.desc],
      Condition: this.exportCondition(rule.condition),
      Consequence: this.exportConsequence(rule.consequence),
    };
  }
  private exportSubSet(subset: SubSet): CQSIMSubRuleSet[] {
    const subRuleSets = subset.subSets.map(this.exportSubSet.bind(this)).flat();
    if (subset.rules.length > 0) {
      subRuleSets.push({
        "#comment": [subset.id, subset.name, subset.desc],
        Rules: {
          Rule: subset.rules.map(this.exportRule.bind(this)),
        },
      });
    }
    if (subset.activation && subset.activation !== "true") {
      for (const s of subRuleSets) {
        if (s.Rules.Rule) {
          for (const r of s.Rules.Rule) {
            if (r.Condition.Expression) {
              r.Condition.Expression = `(${subset.activation}) and (${r.Condition.Expression})`;
            }
          }
        }
      }
    }
    return subRuleSets;
  }
  private exportRuleSet(ruleset: RuleSet): CQSIMRuleSet {
    return {
      "@version": "1.0",
      TypeDefines: {
        TypeDefine: ruleset.typeDefines.map(this.exportTypeDefine.bind(this)),
      },
      MetaInfo: {
        Inputs: {
          Param: ruleset.metaInfo.inputs.map(this.exportInitParam.bind(this)),
        },
        Outputs: {
          Param: ruleset.metaInfo.outputs.map(this.exportInitParam.bind(this)),
        },
        Caches: {
          Param: [
            ...ruleset.metaInfo.caches.map(this.exportInitParam.bind(this)),
            ...ruleset.metaInfo.consts.map(this.exportTempParam.bind(this)),
            ...ruleset.metaInfo.temps.map(this.exportTempParam.bind(this)),
          ],
        },
      },
      SubRuleSets: {
        SubRuleSet: [
          ...(ruleset.rules.length > 0
            ? [
                {
                  "#comment": ["default", "default", "default"],
                  Rules: {
                    Rule: ruleset.rules.map(this.exportRule.bind(this)),
                  },
                },
              ]
            : []),
          ...ruleset.subSets.map(this.exportSubSet.bind(this)).flat(),
        ],
      },
    };
  }

  public export_(ruleset: RuleSet, options: CQSIMExportOptions): string {
    const RuleSet = this.exportRuleSet(ruleset);
    switch (options.reserved) {
      default:
        return this.builder.build({
          "?xml": { "@version": "1.0", "@encoding": "UTF-8" },
          RuleSet,
        });
    }
  }

  private importParameter(param: CQSIMParameter): Parameter {
    return {
      name: param["@name"],
      type: param["@type"],
    };
  }
  private importInitParam(param: CQSIMMetaParam): MetaParam {
    return {
      ...this.importParameter(param),
      desc: param["#comment"] ?? "",
      value: param.InitValue ?? "",
    };
  }
  private importTempParam(param: CQSIMMetaParam): MetaParam {
    return {
      ...this.importParameter(param),
      desc: param["#comment"] ?? "",
      value: param.Value?.Expression ?? "",
    };
  }
  private importCondition(condition: CQSIMCondition): Condition {
    return {
      expression: condition.Expression,
    };
  }
  private importConsequence(consequence: CQSIMConsequence): Consequence {
    const operations =
      consequence.Operation?.map((o) => ({
        target: o.Target,
        method: o.Operation,
        value: o.Args.Expression,
      })) ?? [];
    const assignments =
      consequence.Assignment?.map((a) => ({
        target: a.Target,
        method: "assign",
        value: a.Value.Expression,
      })) ?? [];
    const arrayOperations =
      consequence.ArrayOperation?.map((o) => ({
        target: o.Target,
        method: o.Operation,
        value: o.Args.Expression,
      })) ?? [];
    return {
      operations: [...operations, ...assignments, ...arrayOperations],
    };
  }
  private importTypeDefine(typeDefine: CQSIMTypeDefine): TypeDefine {
    return {
      type: typeDefine["@type"],
      variables: typeDefine.Variable.map(this.importParameter),
    };
  }
  private importRule(rule: CQSIMRule): Rule {
    return {
      id: rule["#comment"]?.[0] ?? randomString(8),
      name: rule["#comment"]?.[1] ?? "规则",
      desc: rule["#comment"]?.[2] ?? "",
      condition: this.importCondition(rule.Condition),
      consequence: this.importConsequence(rule.Consequence),
    };
  }
  private importSubSet(subRuleSet: CQSIMSubRuleSet): SubSet {
    return {
      id: subRuleSet["#comment"]?.[0] ?? randomString(8),
      name: subRuleSet["#comment"]?.[1] ?? "子集",
      desc: subRuleSet["#comment"]?.[2] ?? "",
      activation: "true",
      subSets: [],
      rules: subRuleSet.Rules.Rule.map(this.importRule.bind(this)),
    };
  }
  private importRuleSet(ruleset: CQSIMRuleSet): RuleSet {
    return {
      typeDefines:
        ruleset.TypeDefines.TypeDefine?.map(this.importTypeDefine.bind(this)) ??
        [],
      funcDefines: [],
      metaInfo: {
        inputs:
          ruleset.MetaInfo.Inputs.Param?.map(this.importInitParam.bind(this)) ??
          [],
        outputs:
          ruleset.MetaInfo.Outputs.Param?.map(
            this.importInitParam.bind(this)
          ) ?? [],
        caches:
          ruleset.MetaInfo.Caches.Param?.filter((p) => !p.Value).map(
            this.importInitParam.bind(this)
          ) ?? [],
        consts: [],
        temps:
          ruleset.MetaInfo.Caches.Param?.filter((p) => p.Value).map(
            this.importTempParam.bind(this)
          ) ?? [],
      },
      subSets:
        ruleset.SubRuleSets.SubRuleSet?.map(this.importSubSet.bind(this)) ?? [],
      rules: [],
    };
  }

  public import_(content: string, options: CQSIMImportOptions): RuleSet {
    const RuleSet = this.parser.parse(content);
    switch (options.reserved) {
      default:
        return this.importRuleSet(RuleSet.RuleSet);
    }
  }
}
