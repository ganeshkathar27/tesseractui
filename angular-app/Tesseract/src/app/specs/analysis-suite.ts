import { Configration } from "./analysis-configration";
import { DataKey } from "./data-key";

export class AnalysisSuite {
    public status: string;

    constructor(public suiteName: string,
        public analysisType: string,
        public dataKeys: DataKey[],
        public config: Configration,
    ) {
    }
}