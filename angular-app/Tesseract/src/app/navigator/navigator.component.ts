import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CoreEventEmitterService } from '../services/core-event-emiter/core-event-emitter.service';
import { WidgetSpecification } from '../specs/widget-specification';
import { AddAnalysisDialogComponent } from '../add-analysis-dialog/add-analysis-dialog.component';
import { SourceType } from '../specs/source-type';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DataUploadDialogComponent } from '../data-upload-dialog/data-upload-dialog.component';
import { StreamUploadDialogComponent } from '../stream-upload-dialog/stream-upload-dialog.component';
import { ManageAnalysisSuitesDialogComponent } from '../manage-analysis-suites-dialog/manage-analysis-suites-dialog.component';
import { WidgetType } from '../specs/widget-type';
import { GenericWidgetDialogComponent } from '../widgets/generic-widget-dialog/generic-widget-dialog.component';
import { AuthorisationService } from '../services/authorisation-service/authorisation-service.service';
import { ManageEntitiesComponent } from '../manage-entities/manage-entities.component';
import { AnalysisService } from '../services/analysis-service/analysis-service.service';
import { TrainModelDialogComponent } from '../train-model-dialog/train-model-dialog.component';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0,
        display: 'none'
      })),
    ])
  ]
})
export class NavigatorComponent implements OnInit {

  dataMenuState: string = 'in';
  chartsMenuState: string = 'in';
  streamMenuState: string = 'in';
  miscMenuState: string = 'in';
  accessibleFeatures: string[];

  constructor(private dialog: MatDialog,
    private emitterService: CoreEventEmitterService,
    private authService: AuthorisationService,
    private analysisService: AnalysisService) { }

  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    this.accessibleFeatures = this.authService.getAccessibleFeatures();
  }

  toggleDataMenuState() {
    this.dataMenuState = this.dataMenuState == 'in' ? 'out' : 'in';
  }

  toggleChartMenuState() {
    this.chartsMenuState = this.chartsMenuState == 'in' ? 'out' : 'in';
  }

  toggleStreamMenuState() {
    this.streamMenuState = this.streamMenuState == 'in' ? 'out' : 'in';
  }

  toggleMiscMenuState() {
    this.miscMenuState = this.miscMenuState == 'in' ? 'out' : 'in';
  }

  hasFeature(feature: string) {
    return this.accessibleFeatures && this.accessibleFeatures.includes(feature);
  }

  addNewDashboard() {
    this.emitterService.emitNewDashboardEvent();
  }

  saveDashboard() {
    this.emitterService.emitSaveDashboardEvent(true);
  }

  loadDashboard() {
    this.emitterService.emitLoadDashboardEvent();
  }

  openDataAnalysisDialog(): void {
    let dialogRef = this.dialog.open(AddAnalysisDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        sourceType: SourceType.DATA
      }
    });

    dialogRef.afterClosed().subscribe(spec => {
      if (spec) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification(spec, SourceType.DATA, WidgetType.TIME_SERIES);
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openTrainModelDialog() {
    this.dialog.open(TrainModelDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {}
    });
  }

  openStreamAnalysisDialog(): void {
    let dialogRef = this.dialog.open(AddAnalysisDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        sourceType: SourceType.STREAM
      }
    });

    dialogRef.afterClosed().subscribe(spec => {
      if (spec) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification(spec, SourceType.STREAM, WidgetType.TIME_SERIES);
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openBasicChartDialog(chartType) {
    let config: {} = {
      dataKey: true,
      xAxis: true,
      columnOrExpression: true,
      multipleYAxis: true,
      chartType: chartType
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.BASIC_CHART);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openDataValueWidgetDialog() {
    let config: {} = {
      dataKey: true,
      columnOrExpression: true,
      allowCategorialInColumn: true,
      multipleYAxis: false
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.DATA_VALUE);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openDataTableWidgetDialog() {
    let config: {} = {
      dataKey: true,
      xAxis: true,
      columnOrExpression: true,
      allowCategorialInColumn: true,
      multipleYAxis: true
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.DATA_TABLE);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openGeoMapWidgetDialog() {
    let config: {} = {
      dataKey: true,
      xAxis: true,
      columnOrExpression: true,
      allowCategorialInColumn: true,
      multipleYAxis: true,
      mapType: true
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.GEO_MAP);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openDialWidgetDialog() {
    let config: {} = {
      dataKey: true,
      columnOrExpression: true,
      multipleYAxis: false,
      range: true
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.DIAL);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  openImageWidgetDialog() {
    let config: {} = {
      dataKey: true,
      imageColumn: true
    };
    let dialogRef = this.dialog.open(GenericWidgetDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: { config: config }
    });

    dialogRef.afterClosed().subscribe(config => {
      if (config) {
        let widgetSpecification: WidgetSpecification = new WidgetSpecification([], SourceType.DATA, WidgetType.IMAGE);
        widgetSpecification.configrations = config;
        this.analysisService.addAnalysis(widgetSpecification);
      }
    });
  }

  addStaticTextWidget() {
    let widgetSpecification: WidgetSpecification = new WidgetSpecification(null, SourceType.DATA, WidgetType.STATIC_TEXT);
    this.analysisService.addAnalysis(widgetSpecification);
  }

  addSliceWidget() {
    let widgetSpecification: WidgetSpecification = new WidgetSpecification(null, SourceType.DATA, WidgetType.SLICE);
    this.analysisService.addAnalysis(widgetSpecification);
  }

  openUploadDataDialog() {
    this.dialog.open(DataUploadDialogComponent, {
      width: '1000px',
    });
  }

  openAddStreamDialog() {
    this.dialog.open(StreamUploadDialogComponent, {
      width: '1000px',
    });
  }

  openManageDataDialog() {
    this.dialog.open(ManageEntitiesComponent, {
      width: '1000px',
    });
  }

  openManageAnalysisSuitesDialog() {
    this.dialog.open(ManageAnalysisSuitesDialogComponent, {
      width: '1000px',
    });
  }
}
