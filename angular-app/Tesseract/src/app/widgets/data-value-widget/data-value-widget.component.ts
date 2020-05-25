import { Component, ViewChild, ElementRef } from '@angular/core';
import { WidgetSpecification } from '../../specs/widget-specification';
import { Configration } from '../../specs/analysis-configration';
import { AnalysisSpecification } from '../../specs/analysis-specification';
import { DataKey } from '../../specs/data-key';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractWidget } from '../abstract-widget';
import { MatDialog } from '@angular/material';
import { CoreFetcherService } from '../../services/core-fetcher/core-fetcher.service';
import { CoreEventEmitterService } from '../../services/core-event-emiter/core-event-emitter.service';
import { SliceService } from '../../services/slice-service/slice-service.service';
import { AnalysisService } from '../../services/analysis-service/analysis-service.service';

@Component({
  selector: 'app-data-value-widget',
  templateUrl: './data-value-widget.component.html',
  styleUrls: ['./data-value-widget.component.css']
})
export class DataValueWidgetComponent extends AbstractWidget {

  @ViewChild('dataValueElement', { static: false }) dataValueElement: ElementRef;
  @ViewChild('unitsElement', { static: false }) unitsElement: ElementRef;

  private columnName: string;
  private value: string;

  constructor(protected dialog: MatDialog,
    protected fetcherService: CoreFetcherService,
    protected emiiterService: CoreEventEmitterService,
    protected sliceService: SliceService,
    protected analysisService: AnalysisService) {
    super(dialog, fetcherService, emiiterService, sliceService, analysisService);
  }
  
  getCustomOptions() {
    return {
      units: {
        name: "Units",
        value: "",
        group: "Formatting"
      },
      fontSize: {
        name: "Font Size",
        value: "",
        group: "Formatting"
      },
      conditionalColor: {
        name: "Conditional Color",
        value: "",
        group: "Formatting"
      }
    }
  }

  initialize(widgetSpecification: WidgetSpecification) {
    let specConfig = new Configration();
    this.columnName = widgetSpecification.configrations["selectedColumn"];
    if (widgetSpecification.configrations["expression"]) {
      specConfig.properties["EXPRESSION"] = widgetSpecification.configrations["expression"];
      this.columnName = "Expression Result";
    } else {
      specConfig.properties["TARGET_COLUMNS"] = [this.columnName];
    }
    this.specAdded = new AnalysisSpecification("GROUP_BY", new DataKey(widgetSpecification.configrations["dataKey"]), specConfig);
  }

  deserialize(data: any) {
    this.specAdded = data.specAdded;
    this.customOptions = data.customOptions;
    this.columnName = data.columnName;
    this.value = data.value;
  }

  serialize() {
    return {
      specAdded: this.specAdded,
      customOptions: this.customOptions,
      columnName: this.columnName,
      value: this.value
    };
  }

  refetch() {
    this.loadedStatus = false;
    let spec = this.processSlice(this.specAdded);
    this.fetcherService.runAnalysis([spec]).subscribe((result) => {
      this.value = result[0].columns[this.columnName].data[0];
      if (!this.customOptions['title'].value)
        this.customOptions['title'].value = this.columnName;
      this.reflow();
      this.loadedStatus = true;
    },
      err => {
        if (err instanceof HttpErrorResponse && err.status == 499) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = err.message;
        }
        this.loadedStatus = true;
      });
  }

  reflow() {
    setTimeout(() => {
      this.setFontSize();
      this.applyConditionalFormatting();
    }, 500);
  }

  private applyConditionalFormatting() {
    if (this.customOptions['conditionalColor'] && this.customOptions['conditionalColor'].value) {
      let condFormatting: string = this.customOptions['conditionalColor'].value;
      let ele = this.dataValueElement;
      if (condFormatting.includes(";")) {
        let splits = condFormatting.split(";");
        if (ele) {
          splits.forEach(currTuple => {
            let tupleSplits = currTuple.split("=");
            let currValue = tupleSplits[0].trim();
            let color = tupleSplits[1].trim();

            if (this.value == currValue) {
              ele.nativeElement.style.setProperty('color', color);
              this.unitsElement.nativeElement.style.setProperty('color', color);
            }
          });
        }
      } else {
        ele.nativeElement.style.setProperty('color', condFormatting);
        this.unitsElement.nativeElement.style.setProperty('color', condFormatting);
      }
    }
  }

  private setFontSize() {
    let ele = this.dataValueElement;
    if (ele) {
      let fontSize: number;
      if (this.customOptions['fontSize'] && this.customOptions['fontSize'].value) {
        fontSize = this.customOptions['fontSize'].value;
      } else {
        let width = ele.nativeElement.offsetWidth;
        let height = ele.nativeElement.offsetHeight;
        fontSize = (width * 0.25) < (height * 0.4) ? width * 0.25 : height * 0.4;
      }
      ele.nativeElement.style.setProperty('font-size', fontSize + "px");
      let unitSize = (fontSize * 0.25);
      this.unitsElement.nativeElement.style.setProperty('font-size', unitSize + "px");
      if (!this.customOptions['fontSize']) {
        this.customOptions['fontSize'] = {
          name: "Font Size",
          value: ""
        }
      }
      this.customOptions['fontSize'].value = fontSize;
    }
  }

  applyOptions() {
    this.reflow();
  }
}
