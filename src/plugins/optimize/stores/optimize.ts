import { useCore } from "~/core";
import { ExportOptions } from "~/plugins/convert/plugins";
import { combine, lhdesign } from "~/utils";
import { OptimizeOptions } from "../plugins";

export type Plugin = keyof ExportOptions & keyof OptimizeOptions;

export interface StructFactor {
  id: number;
  start: number;
  end: number;
  contrib: number;
}
export interface ParamFactor {
  id: number;
  start: number;
  end: number;
  lower: number;
  upper: number;
}

export interface OptimizeSample {
  tested: boolean;
  index: number;
  factors: {
    id: number;
    start: number;
    end: number;
    value: string;
  }[];
}

export const useOptimizeStore = defineStore("ruleset", {
  state: () => ({
    id: 0,
    ruleset: "",
    index: 0,

    mode: "struct",
    structFactors: [] as StructFactor[],
    paramFactors: [] as ParamFactor[],

    epochs: 2,
    maxCombinations: [1, 2],
    samplesNumber: [10, 5],
    reserveRatio: 0.5,
    indexThreshold: 0.04,
    indexCalculator: "return 0",

    target: "CQSIM" as Plugin,
    convertOptions: {} as ExportOptions[Plugin],
    optimizeOptions: {} as OptimizeOptions[Plugin],

    dynStructFactors: [] as StructFactor[],
    dynParamFactors: [] as ParamFactor[],
    optimizeEpoches: [] as OptimizeSample[][],
  }),
  getters: {
    testedSamples: (state) => {
      return (epoch = -1) => {
        let ans = 0;
        let samples: OptimizeSample[];
        if (epoch < 0) {
          samples = state.optimizeEpoches.flat();
        } else {
          samples = state.optimizeEpoches[epoch];
        }
        for (const sample of samples) {
          if (sample.tested) {
            ans++;
          }
        }
        return ans;
      };
    },
    bestIndex: (state) => {
      return (epoch = -1) => {
        let ans = state.index;
        let samples: OptimizeSample[];
        if (epoch < 0) {
          samples = state.optimizeEpoches.flat();
        } else {
          samples = state.optimizeEpoches[epoch];
        }
        for (const sample of samples) {
          if (sample.tested && sample.index > ans) {
            ans = sample.index;
          }
        }
        return ans;
      };
    },
  },
  actions: {
    async loadRuleset() {
      const core = useCore();
      const res = await core.select("ruleset", [], { id: this.id });
      if (res.length > 0) {
        this.ruleset = res[0].xml;
      }
    },
    async saveRuleset() {
      const core = useCore();
      let bestSample: Nullable<OptimizeSample> = null;
      for (const samples of this.optimizeEpoches) {
        for (const sample of samples) {
          if (
            sample.tested &&
            sample.index - this.index >= this.indexThreshold &&
            (!bestSample || sample.index > bestSample.index)
          ) {
            bestSample = sample;
          }
        }
      }
      if (bestSample) {
        const bestRuleset = this.genRuleset(bestSample);
        await core.insert("ruleset", {
          id: 0,
          name: "最优规则集",
          version: "1.0.0",
          description: "",
          xml: bestRuleset,
        });
      }
    },
    genRuleset(sample: OptimizeSample) {
      const factors = sample.factors.sort((a, b) => b.start - a.start);
      let ruleset = this.ruleset;
      for (const factor of factors) {
        ruleset =
          ruleset.slice(0, factor.start) +
          factor.value +
          ruleset.slice(factor.end);
      }
      return ruleset;
    },
    genSamples() {
      const l = this.optimizeEpoches.length;
      if (l >= this.epochs) {
        return;
      }
      if (this.mode === "struct") {
        let n1: number, n2: number;
        if (l === 0) {
          n1 = 0;
          n2 = this.maxCombinations[0];
          this.dynStructFactors = this.structFactors.slice(0);
        } else {
          n1 = this.maxCombinations[l - 1];
          n2 = this.maxCombinations[l];
          const tmpObj: Record<number, number> = {};
          for (const sample of this.optimizeEpoches.at(-1)!) {
            for (const factor of sample.factors) {
              if (!(factor.id in tmpObj)) {
                tmpObj[factor.id] = 0;
              }
              tmpObj[factor.id] += sample.index - this.index;
            }
          }
          for (const factor of this.dynStructFactors) {
            factor.contrib = tmpObj[factor.id] ?? 0;
          }
          const K = Math.floor(
            this.dynStructFactors.length * this.reserveRatio
          );
          this.dynStructFactors = this.dynStructFactors
            .sort((a, b) => b.contrib - a.contrib)
            .slice(0, K);
        }
        const results: OptimizeSample["factors"][][] = [];
        for (let n = n1 + 1; n <= n2; n++) {
          results.push(
            combine(
              this.dynStructFactors.map((f) => ({
                id: f.id,
                start: f.start,
                end: f.end,
                value: "",
              })),
              n
            )
          );
        }
        this.optimizeEpoches.push(
          results.flat().map((factors) => ({
            tested: false,
            index: 0,
            factors,
          }))
        );
      } else if (this.mode === "param") {
        if (l === 0) {
          this.dynParamFactors = this.paramFactors.slice(0);
        } else {
          const K = Math.floor(this.samplesNumber[l] * this.reserveRatio);
          const bestSamples = this.optimizeEpoches
            .at(-1)!
            .slice()
            .sort((a, b) => b.index - a.index)
            .slice(0, K);
          const tmpObj: Record<number, { lower: number; upper: number }> = {};
          for (const sample of bestSamples) {
            for (const factor of sample.factors) {
              if (!(factor.id in tmpObj)) {
                tmpObj[factor.id] = { lower: Infinity, upper: -Infinity };
              }
              tmpObj[factor.id].lower = Math.min(
                tmpObj[factor.id].lower,
                Number(factor.value)
              );
              tmpObj[factor.id].upper = Math.max(
                tmpObj[factor.id].upper,
                Number(factor.value)
              );
            }
          }
          for (const factor of this.dynParamFactors) {
            if (factor.id in tmpObj) {
              factor.lower = tmpObj[factor.id].lower;
              factor.upper = tmpObj[factor.id].upper;
            }
          }
        }
        this.optimizeEpoches.push(
          lhdesign(this.dynParamFactors, this.samplesNumber[l]).map(
            (factors) => ({
              tested: false,
              index: 0,
              factors: factors.map((factor, i) => ({
                id: this.dynParamFactors[i].id,
                start: this.dynParamFactors[i].start,
                end: this.dynParamFactors[i].end,
                value: factor.toString(),
              })),
            })
          )
        );
      }
    },
  },
});
