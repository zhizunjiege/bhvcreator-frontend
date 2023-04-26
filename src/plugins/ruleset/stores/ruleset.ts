import { RuleSet } from "..";

export const useRulesetStore = defineStore("ruleset", {
  state: () => ({
    id: 0,
    name: "",
    desc: "",
    ruleset: {
      typeDefines: [],
      funcDefines: [],
      metainfo: {
        consts: [],
        inputs: [],
        outputs: [],
        caches: [],
        temps: [],
      },
      subsets: [],
      rules: [],
    } as RuleSet,
  }),
  actions: {},
});
