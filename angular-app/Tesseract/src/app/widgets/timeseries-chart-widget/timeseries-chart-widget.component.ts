import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CoreFetcherService } from '../../services/core-fetcher/core-fetcher.service';
import { AnalysisResult, AnalysisElement } from '../../specs/analysis-result';
import { AnalysisSpecification } from '../../specs/analysis-specification';
import { Options, stockChart, Chart } from 'highcharts/highstock';
import { CoreEventEmitterService } from '../../services/core-event-emiter/core-event-emitter.service';
import { WidgetSpecification } from '../../specs/widget-specification';
import { MatDialog } from '@angular/material';
import { ConfigrationDialogComponent } from '../../configration-dialog/configration-dialog.component';
import { AddAnalysisDialogComponent } from '../../add-analysis-dialog/add-analysis-dialog.component';
import { StreamingSpecification } from '../../specs/stream-specification';
import { SourceType } from '../../specs/source-type';
import { Series, Point } from 'highcharts';
import { StreamIdentifier } from '../../specs/stream-identifier';
import { HttpErrorResponse } from '@angular/common/http';
import { streamEndErrorType } from '../../app.error-handler';
import { ExportAnalysisDialogComponent } from '../../export-analysis-dialog/export-analysis-dialog.component';
import { MetadataDialogComponent } from '../../metadata-dialog/metadata-dialog.component';

@Component({
  selector: 'app-timeseries-chart-widget',
  templateUrl: './timeseries-chart-widget.component.html',
  styleUrls: ['./timeseries-chart-widget.component.css']
})
export class TimeseriesChartWidgetComponent implements OnInit {

  @Input() public widgetSpecification: WidgetSpecification;
  @ViewChild('chartTarget', { static: false }) chartTarget: ElementRef;

  SHIFT_WINDOW = 120;

  analysisSpecificationsAdded: any[] = [];
  analysisMetadata = [];
  loadedStatus: boolean = false;
  chart: Chart;
  isFullscreen: boolean = false;
  titleparams = [];
  widgetId: string;
  sourceType: SourceType;
  isStreamRunning: boolean;
  streamIndex = 0;
  streamIds = [];
  errorMessage: string;

  constructor(private dialog: MatDialog,
    private fetcherService: CoreFetcherService,
    private emiiterService: CoreEventEmitterService) {
  }

  ngOnInit() {
    this.widgetId = this.widgetSpecification.widgetId;
    this.widgetSpecification.serialize = () => this.serialize();
    if (this.widgetSpecification.serializedWidgetData) {
      this.deserialize(this.widgetSpecification.serializedWidgetData);
      setTimeout(() => this.reflowChart(), 500);
      return;
    }
    this.analysisSpecificationsAdded = this.widgetSpecification.analysisSpecifications;
    this.sourceType = this.widgetSpecification.sourceType;
  }

  ngAfterViewInit() {
    this.loadFullscreenCallback();
    this.loadBlankChart();
    this.emiiterService.listenGridResizeEvent(() => this.reflowChart());
    if (this.isDataSource())
      this.processAnalysis(<AnalysisSpecification[]>this.analysisSpecificationsAdded, true);
    else if (this.isStreamSource())
      this.processStream(<StreamingSpecification[]>this.analysisSpecificationsAdded, true);
  }

  ngOnDestroy() {
    this.stopStreams();
  }

  private deserialize(data: any) {
    this.sourceType = data.sourceType;
    this.analysisSpecificationsAdded = data.analysisSpecificationsAdded;
  }

  private serialize() {
    return {
      sourceType: this.sourceType,
      analysisSpecificationsAdded: this.analysisSpecificationsAdded,
    };
  }

  private isDataSource() {
    return this.sourceType == SourceType.DATA;
  }

  private isStreamSource() {
    return this.sourceType == SourceType.STREAM;
  }

  refetch() {
    this.processAnalysis(<AnalysisSpecification[]>this.analysisSpecificationsAdded, true);
  }

  configureAnalysis() {
    let dialogRef = this.dialog.open(ConfigrationDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        analysisSpecifications: this.analysisSpecificationsAdded,
      }
    });

    dialogRef.afterClosed().subscribe(specs => {
      if (specs) {
        this.processAnalysis(specs, true)
      }
    });
  }

  viewMetadata() {
    if (this.analysisMetadata.length == 0) {
      this.emiiterService.emitMessageEvent("No metadata present for above analysis")
      return
    }
    this.dialog.open(MetadataDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        analysisMetadata: this.analysisMetadata
      }
    });
  }

  addAnalysis() {
    let dialogRef = this.dialog.open(AddAnalysisDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        sourceType: this.sourceType
      }
    });

    dialogRef.afterClosed().subscribe(specs => {
      if (specs) {
        specs.forEach(spec => this.analysisSpecificationsAdded.push(spec));
        if (this.isDataSource()) {
          this.processAnalysis(<AnalysisSpecification[]>specs, false)
        }
        if (this.isStreamSource())
          this.processStream(<StreamingSpecification[]>specs, false)
      }
    });
  }

  deleteWidget() {
    this.stopStreams();
    this.emiiterService.emitDeleteWidgetEvent(this.widgetId);
  }

  stopStreams() {
    this.isStreamRunning = false;
    if (this.isStreamSource())
      this.streamIds.forEach((streamId) => {
        this.fetcherService.stopStream(streamId).subscribe();
        this.streamIds = [];
      })
  }

  loadFullscreenCallback() {
    document.addEventListener('webkitfullscreenchange', () => this.toggleFullScreenFlag(), false);
    document.addEventListener('fullscreenchange', () => this.toggleFullScreenFlag(), false);
  }

  toggleFullScreenFlag() {
    this.isFullscreen = !this.isFullscreen;
  }

  enableFullScreen() {
    let el = document.getElementById(this.widgetId);
    let rfs = el.requestFullscreen;
    rfs.call(el);
  }

  reflowChart() {
    if (this.chart)
      setTimeout(() => {
        this.chart.reflow();
      }, 500);
  }

  loadBlankChart() {
    const options: Options = {
      chart: {
        zoomType: 'x',
        type: 'spline'
      },
      navigator: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Value'
        }
      },
      legend: {
        enabled: true
      },
      series: []
    };

    if (this.isStreamSource()) {
      options.rangeSelector = {
        enabled: false
      };
    }
    this.chart = stockChart(this.chartTarget.nativeElement, options);
  }

  buildTitle(): string {
    let title = ''
    this.titleparams.forEach((element, index) => {
      element = this.buildElementName(element);
      if (index == 0)
        title = element
      else
        title = title + " vs " + element;
    });
    return title;
  }

  buildElementName(elementArray: string[]): string {
    let name;
    elementArray.forEach((element, index) => {
      if (index == 0)
        name = element
      else
        name = name + "-" + element;
    })
    return name;
  }

  processStream(specifications: StreamingSpecification[], reloadChart: boolean) {
    if (reloadChart) {
      this.loadedStatus = false;
      this.reloadChart(reloadChart);
    }
    this.handleStreamTitle(specifications);
    this.fetcherService.analyzeStream(specifications)
      .subscribe(streamIds => {
        this.isStreamRunning = true;
        streamIds.forEach((streamId, index) => {
          this.streamIds.push(streamId);
          this.readStreamingResult(streamId, specifications[index], true, this.streamIndex++)
        })
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

  private readStreamingResult(streamId: StreamIdentifier, specifications, doInit, streamIndex) {
    this.fetcherService.readStream(streamId)
      .subscribe(result => {
        this.addStreamingResult(result, specifications, doInit, streamIndex)
        if (this.isStreamRunning)
          setTimeout(() => {
            this.readStreamingResult(streamId, specifications, false, streamIndex);
          }, 50);
      },
        err => {
          this.streamIds.splice(this.streamIds.indexOf(streamId), 1);
          if (err instanceof HttpErrorResponse && err.status == 499 && err.error.errorReport.type == streamEndErrorType) {
            this.emiiterService.emitMessageEvent(err.error.message);
            return;
          }
          throw err;
        }
      );
  }

  private addStreamingResult(result: AnalysisResult, specifications: StreamingSpecification, doInit: boolean, streamIndex: number): void {
    this.addStreamingData(result.index, result.columns, specifications.analysisType, doInit, streamIndex);
  }

  processAnalysis(specifications: AnalysisSpecification[], reloadChart: boolean) {
    this.loadedStatus = false;
    this.fetcherService.runAnalysis(specifications)
      .subscribe(results => this.addToWidget(results, specifications, reloadChart),
        err => {
          if (err instanceof HttpErrorResponse && err.status == 499) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = err.message;
          }
          this.loadedStatus = true;
          throw err;
        });
  }

  addToWidget(rawData: AnalysisResult[], specifications: AnalysisSpecification[], reloadChart: boolean) {
    this.reloadChart(reloadChart);
    this.handleTitle(specifications);

    rawData.forEach((element, index) => {
      this.addColumns(element.index, element.columns, specifications[index].dataKey.key, specifications[index].analysisType);
      if (element.metadata.elements.length > 0)
        this.analysisMetadata.push({
          dataKey: specifications[index].dataKey,
          analysisType: specifications[index].analysisType,
          elements: element.metadata
        });
    });
    this.loadedStatus = true;
  }

  private reloadChart(reloadChart: boolean) {
    if (reloadChart) {
      this.chart.destroy();
      this.loadBlankChart();
      this.analysisMetadata = [];
      this.titleparams = [];
      this.streamIndex = 0;
    }
  }

  handleTitle(specifications: AnalysisSpecification[]) {
    specifications.forEach(element => {
      let newElemnet = [element.dataKey.key, element.analysisType];
      if (!this.titleparams.includes(newElemnet))
        this.titleparams.push(newElemnet);
    });
    this.chart.setTitle({ text: (this.buildTitle()) });
  }

  handleStreamTitle(specifications: StreamingSpecification[]) {
    specifications.forEach(element => {
      let newElemnet = [element.streamKey.key, element.analysisType];
      if (!this.titleparams.includes(newElemnet))
        this.titleparams.push(newElemnet);
    });
    this.chart.setTitle({ text: (this.buildTitle()) });
  }

  addColumns(index: Object[], columns, dataKey, analysisType) {
    for (let key in columns) {
      let nameElements: string[] = [dataKey, analysisType, key];
      let analysisElement: AnalysisElement = columns[key];
      let hcseries = [];
      analysisElement.data.forEach((value, i) => {
        hcseries.push([index[i], value]);
      });
      this.chart.addSeries({
        name: this.buildElementName(nameElements),
        data: hcseries,
        type: undefined
      })
    }
  }

  private addStreamingData(index, columns, analysisType, doInit, streamIndex) {
    if (doInit) {
      for (let key in columns) {
        let nameElements: string[] = [analysisType, key];
        let hcseries = [];
        let elementName = this.buildElementName(nameElements)
        this.chart.addSeries({
          name: elementName,
          data: hcseries,
          id: elementName + "_" + streamIndex,
          type: undefined
        })
      }
      this.reflowChart();
      this.loadedStatus = true;
    }
    for (let key in columns) {
      let nameElements: string[] = [analysisType, key];
      let elementName = this.buildElementName(nameElements);
      let series: Series = <Series>this.chart.get(elementName + "_" + streamIndex);
      let analysisElement: AnalysisElement = columns[key];
      analysisElement.data.forEach((value, i) => {
        let indexValue = <number>index[i];
        let targetValue = <number>value;
        let pointObject: Point = <Point>this.chart.get(streamIndex + "_" + indexValue);
        if (pointObject != undefined) {
          pointObject.update([indexValue, targetValue], true, true);
        } else {
          let shift = series.data.length > this.SHIFT_WINDOW;
          if (streamIndex == 0) {
            series.addPoint({ x: indexValue, y: targetValue, id: streamIndex + "_" + indexValue }, true, shift, {
              duration: 250
            });
          } else {
            series.addPoint({ x: indexValue, y: targetValue, id: streamIndex + "_" + indexValue }, false, shift, false);
          }
        }
      });
    }
  }

  exportAsCSV() {
    let dialogRef = this.dialog.open(ExportAnalysisDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        inputSpecifications: this.analysisSpecificationsAdded
      }
    });
  }
}
