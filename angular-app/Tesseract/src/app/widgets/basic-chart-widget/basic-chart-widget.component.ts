import { Component, ViewChild, ElementRef } from '@angular/core';
import { WidgetSpecification } from '../../specs/widget-specification';
import { AnalysisSpecification } from '../../specs/analysis-specification';
import { chart } from 'highcharts';
import { AnalysisResult } from '../../specs/analysis-result';
import { HttpErrorResponse } from '@angular/common/http';
import { Configration } from '../../specs/analysis-configration';
import { DataKey } from '../../specs/data-key';
import { DatePipe } from '@angular/common';
import { AbstractWidget } from '../abstract-widget';
import { MatDialog } from '@angular/material';
import { CoreFetcherService } from '../../services/core-fetcher/core-fetcher.service';
import { CoreEventEmitterService } from '../../services/core-event-emiter/core-event-emitter.service';
import { SliceService } from '../../services/slice-service/slice-service.service';
import { AnalysisService } from '../../services/analysis-service/analysis-service.service';
import { SliceOptionsDialogComponent } from '../../slice-options-dialog/slice-options-dialog.component';

@Component({
  selector: 'app-basic-chart-widget',
  templateUrl: './basic-chart-widget.component.html',
  styleUrls: ['./basic-chart-widget.component.css']
})
export class BasicChartWidgetComponent extends AbstractWidget {

  @ViewChild('chartTarget', { static: false }) private chartTarget: ElementRef;

  private chart: Highcharts.Chart;
  private chartType: string;
  targets: string[] = [];

  private chartMapping = {
    bar: "column",
    line: "line",
    pie: "pie",
    area: "area"
  }

  getCustomOptions(): {} {
    return {
      xAxisLabel: {
        name: "X Axis Label",
        value: "",
        group: "X Axis",
        chartPath: "xAxis.title.text"
      },
      yAxisLabel: {
        name: "Y Axis Label",
        value: "",
        group: "Y Axis",
        chartPath: "yAxis.title.text"
      },
      dateFormat: {
        name: "Date Format",
        value: "dd/MMM/yyyy",
        group: "X Axis",
        chartPath: "data.dateFormat"
      },
      xPlotBand: {
        name: "X-Axis Plot Band Expression",
        value: "",
        group: "X Axis"
      }
    };
  }

  constructor(protected dialog: MatDialog,
    protected fetcherService: CoreFetcherService,
    protected emiiterService: CoreEventEmitterService,
    protected sliceService: SliceService,
    protected analysisService: AnalysisService) {
    super(dialog, fetcherService, emiiterService, sliceService, analysisService);
  }

  initialize(widgetSpecification: WidgetSpecification) {
    let specConfig = new Configration();
    if (widgetSpecification.configrations["expression"]) {
      specConfig.properties["EXPRESSION"] = widgetSpecification.configrations["expression"];
    } else {
      specConfig.properties["TARGET_COLUMNS"] = widgetSpecification.configrations["selectedColumn"];
    }
    specConfig.properties["GROUPBY_COLUMN_NAME"] = widgetSpecification.configrations["xAxis"];
    this.chartType = widgetSpecification.configrations["chartType"];
    this.specAdded = new AnalysisSpecification("GROUP_BY", new DataKey(widgetSpecification.configrations["dataKey"]), specConfig);
  }

  deserialize(data: any) {
    this.specAdded = data.specAdded;
    this.customOptions = data.customOptions;
    this.chartType = data.chartType;
    this.targets = data.targets;
  }

  serialize() {
    return {
      specAdded: this.specAdded,
      customOptions: this.customOptions,
      chartType: this.chartType,
      targets: this.targets
    };
  }

  refetch(hard: boolean) {
    this.loadedStatus = false;
    this.errorMessage = null;
    let spec = this.processSlice(this.specAdded);
    this.fetcherService.runAnalysis([spec]).subscribe((result) => {
      if (hard || !this.customOptions['title'].value) {
        let targetColumns = this.specAdded.configurations.properties["TARGET_COLUMNS"];
        if (!targetColumns)
          targetColumns = "Expression Result";
        this.customOptions['title'].value = targetColumns + " by " + this.specAdded.configurations.properties["GROUPBY_COLUMN_NAME"];
      }
      if (hard || !this.customOptions['xAxisLabel'].value)
        this.customOptions['xAxisLabel'].value = spec.configurations.properties["GROUPBY_COLUMN_NAME"]
      if (hard || !this.customOptions['yAxisLabel'].value)
        this.customOptions['yAxisLabel'].value = Object.keys(result[0].columns)[0]
      this.plotChart(result);
      setTimeout(() => this.applySliceOnTargets(), 2000);
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

  private plotChart(result: AnalysisResult[]) {
    this.processDates(result);
    let formatDatesFunction = (value: any) => this.formatDatesFunction(value)
    let chartOptions: Highcharts.Options = {
      chart: {
        type: this.chartMapping[this.chartType],
        zoomType: 'x'
      },
      plotOptions: {
        series: {
          lineWidth: 3
        },
        column: {
          dataLabels: {
            enabled: true,
            format: '{point.y:,.2f}'
          }
        },
        pie: {
          dataLabels: {
            formatter: function () {
              var sliceIndex = this.point.index;
              var sliceName = this.series.chart.axes[0].categories[sliceIndex];
              return sliceName;
            }
          }
        }
      },
      xAxis: {
        categories: result[0].index,
        labels: {
          formatter: function () {
            return formatDatesFunction(this.value);
          }
        }
      },
      series: this.prepareSeries(result[0])
    };
    this.chart = chart(this.chartTarget.nativeElement, chartOptions);
    this.applyOptions();
    this.loadedStatus = true;
  }

  private formatDatesFunction(value: string) {
    if (this.customOptions['dateFormat'] && this.customOptions['dateFormat'].value && this.isXAxisDate()) {
      var datePipe = new DatePipe("en-US");
      return datePipe.transform(value, this.customOptions['dateFormat'].value);
    }
    else
      return value;
  }

  private processDates(result: AnalysisResult[]) {
    if (this.isXAxisDate())
      result[0].index = result[0].index.map(lng => new Date(lng as number));
  }

  private isXAxisDate() {
    return this.analysisService.getDataInfo(this.specAdded.dataKey).columnProperties[this.specAdded.configurations.properties["GROUPBY_COLUMN_NAME"]]["dataType"] == "DATE";
  }

  private prepareSeries(result: AnalysisResult) {
    let series = [];
    Object.keys(result.columns).forEach(colName => {
      if (!this.customOptions["series" + series.length + "Label"])
        this.customOptions["series" + series.length + "Label"] = {
          name: colName + " Series Label",
          value: colName,
          group: colName + " Series",
          chartPath: "name",
          chartElementId: "series" + series.length
        }
      if (!this.customOptions["series" + series.length + "Color"])
        this.customOptions["series" + series.length + "Color"] = {
          name: colName + " Series Color",
          value: null,
          group: colName + " Series",
          chartPath: "color",
          chartElementId: "series" + series.length
        }
      if (!this.customOptions["series" + series.length + "ShowDataLabels"])
        this.customOptions["series" + series.length + "ShowDataLabels"] = {
          name: "Show Data Labels",
          value: "false",
          group: colName + " Series",
          chartPath: "dataLabels.enabled",
          chartElementId: "series" + series.length,
        }
      this.customOptions["series" + series.length + "ShowDataLabels"]["transform"] = (value: string) => value == 'true'
      series.push({
        id: "series" + series.length,
        data: result.columns[colName].data
      })
    });
    return series;
  }

  reflow() {
    if (this.chart)
      setTimeout(() => {
        this.chart.reflow();
      }, 500);
  }

  handleSlice() {
    let dialogRef = this.dialog.open(SliceOptionsDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        widgetId: this.getWidgetId()
      }
    });

    dialogRef.afterClosed().subscribe(selectedTargets => {
      this.targets = selectedTargets;
      this.applySliceOnTargets();
    });
  }

  applySliceOnTargets() {
    if (this.targets == null)
      return;

    if (this.targets.length == 0) {
      this.sliceService.removePublisher(this.getWidgetId());
      this.chart.update({
        plotOptions: {
          series: {
            allowPointSelect: false
          }
        }
      })
      return;
    }

    this.sliceService.registerPublisher(this.getWidgetId(), this.targets);
    this.chart.update({
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          point: {
            events: {
              click: (event) => {
                let sliceValue = event.point.category;
                if (event.point.series["slicedValue"] == sliceValue) {
                  sliceValue = null;
                }
                const sliceConfig = [{
                  dataKey: this.specAdded.dataKey.key,
                  dataType: 'CATEGORICAL',
                  column: this.specAdded.configurations.properties["GROUPBY_COLUMN_NAME"],
                  data: {
                    uniqueValues: sliceValue == null ? [] : [{ name: sliceValue, selected: true }]
                  }
                }];
                const expr = this.sliceService.buildExpression(sliceConfig, null);
                this.sliceService.publish(this.getWidgetId(), expr);
                this.sliceService.apply(this.getWidgetId());
                event.point.series["slicedValue"] = sliceValue;
              }
            }
          }
        }
      }
    })
  }

  applyOptions() {
    this.applyOptionsToChartObject(this.chart);
    let formatDatesFunction = (value): string => this.formatDatesFunction(value)
    this.chart.xAxis[0].update({
      labels: {
        formatter: function () {
          return formatDatesFunction(this.value);
        }
      }
    })
    this.handlePlotbands();
  }

  private handlePlotbands() {
    this.chart.xAxis[0].removePlotBand("plotBandForXAxisExpr");
    if (this.customOptions["xPlotBand"] && this.customOptions["xPlotBand"].value) {
      this.loadedStatus = false;
      const configs = new Configration();
      configs.properties = { ...this.specAdded.configurations.properties };
      delete configs.properties["TARGET_COLUMNS"];
      configs.properties["EXPRESSION"] = this.customOptions["xPlotBand"].value;
      let bandSpec = new AnalysisSpecification(this.specAdded.analysisType, this.specAdded.dataKey, configs);
      bandSpec = this.processSlice(bandSpec);
      this.fetcherService.runAnalysis([bandSpec]).subscribe((result) => {
        this.loadedStatus = true;
        let bandStart = null;
        result[0].columns["Expression Result"].data.forEach((d, i) => {
          if (d && !bandStart) {
            bandStart = i;
          }
          if (!d && bandStart) {
            this.chart.xAxis[0].addPlotBand({
              id: 'plotBandForXAxisExpr',
              from: result[0].index[bandStart],
              to: result[0].index[i]
            });
            bandStart = null;
          }
        });
        if (bandStart) {
          this.chart.xAxis[0].addPlotBand({
            id: 'plotBandForXAxisExpr',
            from: result[0].index[bandStart],
            to: result[0].index[result[0].index.length - 1]
          });
        }
        this.chart.redraw();
      }, err => {
        if (err instanceof HttpErrorResponse && err.status == 499) {
          this.errorMessage = err.error.message;
        }
        else {
          this.errorMessage = err.message;
        }
        this.loadedStatus = true;
      });
    }
  }
}
