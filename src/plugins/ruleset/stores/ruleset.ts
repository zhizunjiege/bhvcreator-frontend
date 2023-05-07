import { useCore } from "~/core";
import { getTimestampString, isUnique } from "~/utils";
import { RuleSet, useRuleSet } from "..";

export interface RuleSetAttr {
  id: number;
  name: string;
  version: string;
  description: string;
  createTime: string;
  updateTime: string;
}

export const useRuleSetStore = defineStore("ruleset", {
  state: () => ({
    ruleset: {
      id: 0,
      name: "规则集",
      version: "1.0.0",
      description: "规则集",
      createTime: getTimestampString(),
      updateTime: getTimestampString(),

      typeDefines: [],
      funcDefines: [],
      metaInfo: {
        inputs: [],
        outputs: [],
        caches: [],
        consts: [],
        temps: [],
      },
      subSets: [],
      rules: [],
    } as RuleSet & RuleSetAttr,
  }),
  // getters: {
  //   required: () => (v: string) => !!v,
  //   token: () => (v: string) => /^[a-zA-Z_][a-zA-Z0-9_]*/.test(v),
  //   type: () => (v: string) =>
  //     /(?:(?:float|u?int)(?:16|32|64)|bool|string)(\[\])?/.test(v),
  // },
  actions: {
    failure(message: string) {
      return { success: false, message };
    },
    success() {
      return { success: true };
    },
    // TODO: add more validation
    validate(): { success: boolean; message?: string } {
      if (!this.ruleset.name || !this.ruleset.version) {
        return this.failure("名称和版本不能为空");
      }
      if (!isUnique(this.ruleset.typeDefines.map((e) => e.type))) {
        return this.failure("类型定义中存在重复");
      }
      if (!isUnique(this.ruleset.funcDefines.map((e) => e.symbol))) {
        return this.failure("函数定义中存在重复");
      }
      if (
        !isUnique(
          Object.values(this.ruleset.metaInfo)
            .map((e) => e.map((e) => e.name))
            .flat()
        )
      ) {
        return this.failure("参数定义中存在重复");
      }
      return this.success();
    },
    async save() {
      const core = useCore();
      const plugin = useRuleSet();
      const xml = plugin.build({
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
        description: this.ruleset.description,
        mode: "normal",
        xml,
      });
      if (this.ruleset.id === 0) {
        this.ruleset.id = res.lastrowid;
        this.ruleset.createTime = getTimestampString();
      }
      this.ruleset.updateTime = getTimestampString();
    },
    async load(id: number) {
      const core = useCore();
      const plugin = useRuleSet();
      const res = await core.select("ruleset", [], { id });
      if (res.length) {
        const ruleset = plugin.parse(res[0].xml);
        Object.assign(this.ruleset, {
          id: res[0].id,
          name: res[0].name,
          version: res[0].version,
          description: res[0].description,
          createTime: res[0].create_time,
          updateTime: res[0].update_time,
          ...ruleset,
        });
      }
    },
  },
});
