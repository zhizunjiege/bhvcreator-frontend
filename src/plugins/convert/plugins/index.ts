import { ConvertChildPlugin } from "../core";
import {
  CQSIMExportOptions,
  CQSIMImportOptions,
  CQSIMConvertPlugin,
} from "./cqsim";

export interface ExportOptions {
  CQSIM: CQSIMExportOptions;
}

export interface ImportOptions {
  CQSIM: CQSIMImportOptions;
}

export function createChildPlugins(): ConvertChildPlugin[] {
  return [new CQSIMConvertPlugin()];
}
