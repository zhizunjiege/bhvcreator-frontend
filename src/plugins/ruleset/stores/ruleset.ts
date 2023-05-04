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
      name: "规则集",
      version: "1.0.0",
      desc: "规则集",
      createTime: getTimestampString(),
      updateTime: getTimestampString(),

      typeDefines: [
        {
          type: "Location",
          variables: [
            {
              name: "longitude",
              type: "float64",
            },
            {
              name: "latitude",
              type: "float64",
            },
            {
              name: "altitude",
              type: "float64",
            },
          ],
        },
        {
          type: "Vector3",
          variables: [
            {
              name: "x",
              type: "float64",
            },
            {
              name: "y",
              type: "float64",
            },
            {
              name: "z",
              type: "float64",
            },
          ],
        },
      ],
      funcDefines: [
        {
          type: "normal",
          symbol: "add",
          params: [
            {
              name: "a",
              type: "float64",
            },
            {
              name: "b",
              type: "float64",
            },
          ],
          return: {
            type: "float64",
            value: "a+b",
          },
        },
        {
          type: "operator",
          symbol: "*",
          params: [
            {
              name: "a",
              type: "Vector3",
            },
            {
              name: "b",
              type: "Vector3",
            },
          ],
          return: {
            type: "float64",
            value: "a.x*b.x+a.y*b.y+a.z*b.z",
          },
        },
      ],
      metaInfo: {
        inputs: [
          {
            name: "input1",
            type: "float64[]",
            desc: "输入1",
            value: "[]",
          },
          {
            name: "input2",
            type: "float64",
            desc: "输入2",
            value: "0",
          },
        ],
        outputs: [
          {
            name: "output1",
            type: "float64",
            desc: "输出1",
            value: "0",
          },
        ],
        caches: [
          {
            name: "cache1",
            type: "float64[]",
            desc: "缓存1",
            value: "[]",
          },
        ],
        consts: [
          {
            name: "const1",
            type: "float64",
            desc: "常量1",
            value: "3.1415926535",
          },
        ],
        temps: [
          {
            name: "temp1",
            type: "float64",
            desc: "中间变量1",
            value: "input1[0]+input2",
          },
        ],
      },
      subSets: [
        {
          id: "sj6hkj99",
          name: "子集1",
          desc: "子集1",
          condition: {
            join: "and",
            expressions: ["true"],
          },
          subSets: [],
          rules: [
            {
              id: "hj6789hk",
              name: "规则1",
              desc: "规则1",
              condition: {
                join: "and",
                expressions: ["cache1.length()==0"],
              },
              consequence: {
                assignments: [
                  {
                    target: "cache1",
                    value: "input1",
                  },
                ],
                operations: [],
              },
            },
            {
              id: "jhks9672",
              name: "规则2",
              desc: "规则2",
              condition: {
                join: "and",
                expressions: ["cache1.length()!=0"],
              },
              consequence: {
                assignments: [
                  {
                    target: "output1",
                    value: "cache1[cache1.length()-1]",
                  },
                ],
                operations: [
                  {
                    target: "cache1",
                    operation: "push",
                    args: "temp1",
                  },
                ],
              },
            },
          ],
        },

        {
          id: "gja87dd3",
          name: "子集2",
          desc: "子集2",
          condition: {
            join: "and",
            expressions: ["true"],
          },
          subSets: [],
          rules: [
            {
              id: "hj6789hk",
              name: "规则1",
              desc: "规则1",
              condition: {
                join: "and",
                expressions: ["cache1.length()==0"],
              },
              consequence: {
                assignments: [
                  {
                    target: "cache1",
                    value: "input1",
                  },
                ],
                operations: [],
              },
            },
            {
              id: "jhks9672",
              name: "规则2",
              desc: "规则2",
              condition: {
                join: "and",
                expressions: ["cache1.length()!=0"],
              },
              consequence: {
                assignments: [
                  {
                    target: "output1",
                    value: "cache1[cache1.length()-1]",
                  },
                ],
                operations: [
                  {
                    target: "cache1",
                    operation: "push",
                    args: "temp1",
                  },
                ],
              },
            },
          ],
        },
      ],
      rules: [
        {
          id: "hj6789hk",
          name: "规则1",
          desc: "规则1",
          condition: {
            join: "and",
            expressions: ["cache1.length()==0"],
          },
          consequence: {
            assignments: [
              {
                target: "cache1",
                value: "input1",
              },
            ],
            operations: [],
          },
        },
        {
          id: "jhks9672",
          name: "规则2",
          desc: "规则2",
          condition: {
            join: "and",
            expressions: ["cache1.length()!=0"],
          },
          consequence: {
            assignments: [
              {
                target: "output1",
                value: "cache1[cache1.length()-1]",
              },
            ],
            operations: [
              {
                target: "cache1",
                operation: "push",
                args: "temp1",
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
