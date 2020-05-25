import { Configration } from "./analysis-configration";
import { DataKey } from "./data-key";
import { AnalysisMetadata } from "./analysis-result";

export class ModelInfo {
    public modelName: string;
    public analysisType: string;
    public configurations: Configration;
    public metadata: AnalysisMetadata;
    public status: string;
    public error: any;
}