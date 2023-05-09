import { RuleSet } from "~/plugins/ruleset";

export interface ConvertChildPlugin {
  name: string;
  version: string;
  export_(ruleset: RuleSet, options: object): string;
  import_(content: string, options: object): RuleSet;
}
