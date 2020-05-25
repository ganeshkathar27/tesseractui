import { Configration } from "./analysis-configration";
import { DataKey } from "./data-key";
import { AnalysisMetadata } from "./analysis-result";

export class AnalysisInfo {
    constructor(public analysisType: string,
        public dataKey: DataKey,
        public configurations: Configration,
        public metadata: AnalysisMetadata,
        public resultDataKey: DataKey,
        public error: string) {
    }
}