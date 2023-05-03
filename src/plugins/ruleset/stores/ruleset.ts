import { getTimestampString } from "~/utils";
import { RuleSet } from "..";

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
  actions: {},
});
