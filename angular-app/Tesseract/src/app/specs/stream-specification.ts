import { Configration } from "./analysis-configration";
import { StreamKey } from "./stream-key";

export class StreamingSpecification {
    constructor(public analysisType: string,
        public streamKey: StreamKey,
        public configurations: Configration) {
    }
}