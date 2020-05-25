import { Component, ViewChild, ElementRef } from '@angular/core';
import { WidgetSpecification } from '../../specs/widget-specification';
import { Configration } from '../../specs/analysis-configration';
import { AnalysisSpecification } from '../../specs/analysis-specification';
import { DataKey } from '../../specs/data-key';
import { HttpErrorResponse } from '@angular/common/http';
import { chart } from 'highcharts/';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
import HC_solid_gauge from 'highcharts/modules/solid-gauge.src';
import { HumanizePipe } from '../../pipes/humanize';
import { AbstractWidget } from '../abstract-widget';
import { MatDialog } from '@angular/material';
import { CoreFetcherService } from '../../services/core-fetcher/core-fetcher.service';
import { CoreEventEmitterService } from '../../services/core-event-emiter/core-event-emitter.service';
import { SliceService } from '../../services/slice-service/slice-service.service';
import { AnalysisService } from '../../services/analysis-service/analysis-service.service';
HC_solid_gauge(Highcharts);

@Component({
  selector: 'app-dial-widget',
  templateUrl: './dial-widget.component.html',
  styleUrls: ['./dial-widget.component.css']
})
export class DialWidgetComponent extends AbstractWidget {

  columnName: string;
  value: number;
  minRange: number;
  maxRange: number;
  @ViewChild('chartTarget', { static: false }) chartTarget: ElementRef;
  chart: Highcharts.Chart;
  humanize = new HumanizePipe();
  
  constructor(protected dialog: MatDialog,
    protected fetcherService: CoreFetcherService,
    protected emiiterService: CoreEventEmitterService,
    protected sliceService: SliceService,
    protected analysisService: AnalysisService) {
    super(dialog, fetcherService, emiiterService, sliceService, analysisService);
  }
  
  initialize(widgetSpecification: WidgetSpecification) {
    let specConfig = new Configration();
    this.columnName = widgetSpecification.configrations["selectedColumn"];
    this.minRange = widgetSpecification.configrations["minRange"];
    this.maxRange = widgetSpecification.configrations["maxRange"];
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
    this.minRange = data.minRange;
    this.maxRange = data.maxRange;
  }

  serialize() {
    return {
      specAdded: this.specAdded,
      customOptions: this.customOptions,
      columnName: this.columnName,
      value: this.value,
      minRange: this.minRange,
      maxRange: this.maxRange
    };
  }

  refetch() {
    this.loadedStatus = false;
    let spec = this.processSlice(this.specAdded);
    this.fetcherService.runAnalysis([spec]).subscribe((result) => {
      this.value = result[0].columns[this.columnName].data[0];
      if (!this.customOptions['title'].value)
        this.customOptions['title'].value = this.columnName;
      this.plotChart();
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
    if (this.chart)
      setTimeout(() => {
        this.chart.reflow();
      }, 500);
  }

  private plotChart() {
    const options: Highcharts.Options = {
      chart: {
        type: 'solidgauge',
        height: "85%"
      },

      title: {
        text: this.customOptions['title'].value
      },

      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [{
          backgroundColor: '#FFF',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }],
        size: '100%'
      },

      tooltip: {
        enabled: false
      },

      yAxis: {
        stops: [
          [0.1, '#DF5353'],
          [0.5, '#DDDF0D'], // yellow
          [0.8, '#55BF3B']
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          text: this.humanize.transform(this.value),
          style: {
            fontSize: '16px',
            color: "#000000",
            fontWeight: 'bold'
          },
          y: 50
        },
        labels: {
          enabled: false
        },
        min: this.minRange,
        max: this.maxRange
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            formatter: function () {
              return null;
            }
          }
        }
      },
      series: [{
        data: [this.value],
        type: 'solidgauge'
      }]
    };
    this.chart = chart(this.chartTarget.nativeElement, options);
  }

  applyOptions() {
    this.chart.setTitle({ text: this.customOptions['title'].value });
  }
  getCustomOptions(): {} {return {}}
}
