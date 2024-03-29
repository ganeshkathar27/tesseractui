import { AnalysisSpecification } from "./analysis-specification";
import { v4 as uuid } from 'uuid';
import { StreamingSpecification } from "./stream-specification";
import { SourceType } from "./source-type";
import { WidgetType } from "./widget-type";
import { noop } from "rxjs";

export class WidgetSpecification {
    widgetId: string = uuid();
    x: number;
    y: number;
    rows: number;
    cols: number;
    configrations: {} = {};
    serialize: Function = noop;
    serializedWidgetData: any;
    constructor(public analysisSpecifications: AnalysisSpecification[] | StreamingSpecification[],
        public sourceType: SourceType,
        public widgetType: WidgetType) {
    }
}