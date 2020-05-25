import { Configration } from "./analysis-configration";
import { DataKey } from "./data-key";

export class ModelSpecification {
    
    constructor(public modelName: string,
        public analysisType: string,
        public dataKey: DataKey,
        public configurations: Configration) {
    }
}