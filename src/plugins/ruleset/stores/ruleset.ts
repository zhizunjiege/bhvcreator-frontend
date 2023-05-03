import { useCore } from "~/core";
import { getTimestampString } from "~/utils";
import { RuleSet, useRuleSet } from "..";

export interface RuleSetAttr {
  id: number;
  name: string;
  version: string;
  desc: string;
  createTime: string;
  updateTime: string;
}

export const useRuleSetStore = defineStore("ruleset", {
  state: () => ({
    ruleset: {
      id: 0,
      name: "未命名规则集",
      version: "1.0.0",
      desc: "未命名规则集",
      createTime: getTimestampString(),
      updateTime: getTimestampString(),

      typeDefines: [],
      funcDefines: [],
      metaInfo: {
        inputs: [
          {
            name: "input1",
            type: "float64",
            desc: "输入1",
            value: "0",
          },
        ],
        outputs: [],
        caches: [],
        consts: [],
        temps: [],
      },
      subSets: [
        {
          id: "sjhkj699",
          name: "未命名子集",
          desc: "未命名子集",
          condition: {
            join: "and",
            expressions: ["true"],
          },
          subSets: [
            {
              id: "hj6789hk",
              name: "未命名子集",
              desc: "未命名子集",
              condition: {
                join: "and",
                expressions: ["true"],
              },
              subSets: [],
              rules: [],
            },
            {
              id: "gja87dd3",
              name: "未命名子集",
              desc: "未命名子集",
              condition: {
                join: "and",
                expressions: ["true"],
              },
              subSets: [],
              rules: [],
            },
          ],
          rules: [],
        },
      ],
      rules: [
        {
          id: "hj6789hk",
          name: "未命名规则",
          desc: "未命名规则",
          condition: {
            join: "and",
            expressions: ["true"],
          },
          consequence: {
            assignments: [
              {
                target: "",
                value: "",
              },
            ],
            operations: [
              {
                target: "",
                operation: "",
                args: "",
              },
            ],
          },
        },
      ],
    } as RuleSet & RuleSetAttr,
  }),
  actions: {
    validate() {
      return true;
    },
    async save() {
      const core = useCore();
      const plugin = useRuleSet();
      const xml = plugin.buildRuleSet({
        typeDefines: this.ruleset.typeDefines,
        funcDefines: this.ruleset.funcDefines,
        metaInfo: this.ruleset.metaInfo,
        subSets: this.ruleset.subSets,
        rules: this.ruleset.rules,
      });
      const res = await core.replace("ruleset", {
        id: this.ruleset.id,
        name: this.ruleset.name,
        version: this.ruleset.version,
        description: this.ruleset.desc,
        mode: "normal",
        xml,
      });
      if (this.ruleset.id === 0) {
        this.ruleset.id = res.lastrowid;
        this.ruleset.createTime = getTimestampString();
      }
      this.ruleset.updateTime = getTimestampString();
    },
  },
});
