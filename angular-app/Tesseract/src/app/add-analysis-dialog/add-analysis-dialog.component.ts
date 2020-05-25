import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { AnalysisService } from '../services/analysis-service/analysis-service.service';
import { DataKey } from '../specs/data-key';
import { AnalysisSpecification } from '../specs/analysis-specification';
import { Configration } from '../specs/analysis-configration';
import { DataUploadDialogComponent } from '../data-upload-dialog/data-upload-dialog.component';
import { SourceType } from '../specs/source-type';
import { StreamUploadDialogComponent } from '../stream-upload-dialog/stream-upload-dialog.component';
import { StreamingSpecification } from '../specs/stream-specification';
import { StreamKey } from '../specs/stream-key';
import { DataInfo } from '../specs/data-info';
import { DATA_PERIODS } from '../specs/data-period';

@Component({
  selector: 'app-add-analysis-dialog',
  templateUrl: './add-analysis-dialog.component.html',
  styleUrls: ['./add-analysis-dialog.component.css']
})
export class AddAnalysisDialogComponent implements OnInit {

  errorMessage: string = "";
  keys: string[];
  indexes: string[];
  periods: string[];
  targets: string[];
  analysisInfos: (string | boolean)[][];
  componentsLoaded: number = 0;
  sourceType: SourceType;
  selectedDataKey: string = null;
  selectedIndex: string = null;
  selectedTarget: string = null;
  selectedPeriod: string = null;
  analysisFormControl = new FormControl();

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddAnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetcherService: CoreFetcherService,
    private analysisService: AnalysisService) {
    this.sourceType = data.sourceType;
    this.periods = DATA_PERIODS;
  }

  ngOnInit() {
    this.fetchKeys();
    this.fetchAnalysisInfos();
  }

  private fetchKeys() {
    if (this.isDataSource())
      this.fetchDataKeys();
    else if (this.isStreamSource())
      this.fetchStreamKeys();
  }

  onDataKeySelect = (dataKey) => {
    if (dataKey) {
      this.selectedDataKey = dataKey;
      if (this.isDataSource()) {
        let dataInfo: DataInfo = this.analysisService.getDataInfo(new DataKey(dataKey));
        this.indexes = Object.keys(dataInfo.columnProperties).filter(columnName => dataInfo.columnProperties[columnName]["dataType"] == "DATE")
        this.targets = Object.keys(dataInfo.columnProperties).filter(columnName => dataInfo.columnProperties[columnName]["dataType"] == "NUMERICAL")
      }
    } else {
      this.selectedDataKey = null;
      this.indexes = null;
      this.targets = null;
    }
  }

  onIndexSelect = (index) => {
    if (index) {
      this.selectedIndex = index;
    } else {
      this.selectedIndex = null;
    }
  }

  onTargetSelect = (target) => {
    if (target) {
      this.selectedTarget = target;
    } else {
      this.selectedTarget = null;
    }
  }

  onDataPeriodSelect = (period) => {
    if (period) {
      this.selectedPeriod = period;
    } else {
      this.selectedPeriod = null;
    }
  }

  fetchAnalysisInfos() {
    let analysisInfo;
    if (this.isDataSource())
      analysisInfo = this.fetcherService.getTimeSeriesAnalysisInfos();
    else if (this.isStreamSource())
      analysisInfo = this.fetcherService.getStreamSupportedAnalysisInfos();
    analysisInfo.subscribe(
      analysisInfos => this.loadAnalysisInfos(analysisInfos),
      err => {
        this.dialogRef.close();
        throw err;
      }
    )
  }

  fetchDataKeys() {
    this.fetcherService.getTimeSeriesDataKeys().subscribe(
      dataKeys => this.loadKeys(dataKeys),
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  fetchStreamKeys() {
    this.fetcherService.getStreamKeys().subscribe(
      dataKeys => this.loadKeys(dataKeys),
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  openUploadDialog() {
    if (this.isDataSource())
      this.openUploadDataDialog();
    else if (this.isStreamSource())
      this.openAddStreamDialog();
  }

  isDataSource() {
    return this.sourceType == SourceType.DATA;
  }

  isStreamSource() {
    return this.sourceType == SourceType.STREAM;
  }

  openUploadDataDialog() {
    let dialogRef = this.dialog.open(DataUploadDialogComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.componentsLoaded -= 1;
      this.fetchDataKeys();
    })
  }

  openAddStreamDialog() {
    let dialogRef = this.dialog.open(StreamUploadDialogComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.componentsLoaded -= 1;
      this.fetchStreamKeys();
    })
  }

  addAnalysis() {
    if (!this.selectedDataKey) {
      this.errorMessage = "Key Cannot be empty";
      return;
    }
    if (this.isDataSource() && !this.selectedIndex) {
      this.errorMessage = "Index Cannot be empty";
      return;
    }
    if (this.isDataSource() && !this.selectedPeriod) {
      this.errorMessage = "Period Cannot be empty";
      return;
    }
    if (this.isDataSource() && !this.selectedTarget) {
      this.errorMessage = "Target Cannot be empty";
      return;
    }

    let selectedAnalysis: (string)[] = this.analysisInfos
      .filter(opt => opt[1])
      .map(opt => opt[0].toString());

    if (selectedAnalysis.length == 0) {
      this.errorMessage = "Please select at least one analysis";
      return;
    }
    this.errorMessage = "";
    let specifications: AnalysisSpecification[] | StreamingSpecification[];
    if (this.isDataSource())
      specifications = this.buildAnalysisSpecifications(selectedAnalysis);
    if (this.isStreamSource())
      specifications = this.buildStreamingSpecifications(selectedAnalysis);
    this.dialogRef.close(specifications);
  }

  private buildAnalysisSpecifications(selectedAnalysis: string[]) {
    let dataKey = new DataKey(this.selectedDataKey);
    let specifications: AnalysisSpecification[] = [];
    for (var i = 0; i < selectedAnalysis.length; i++) {
      let config = new Configration();
      config.properties["INDEX_COLUMN_NAME"] = this.selectedIndex;
      config.properties["PRIMARY_COLUMN_NAME"] = this.selectedTarget;
      config.properties["DATA_PERIOD"] = this.selectedPeriod;

      let spec = new AnalysisSpecification(selectedAnalysis[i], dataKey, config);
      specifications.push(spec);
    }
    return specifications;
  }

  private buildStreamingSpecifications(selectedAnalysis: string[]) {
    let dataKey = new StreamKey(this.selectedDataKey);
    let specifications: StreamingSpecification[] = [];
    for (var i = 0; i < selectedAnalysis.length; i++) {
      let config = new Configration();
      let spec = new StreamingSpecification(selectedAnalysis[i], dataKey, config);
      specifications.push(spec);
    }
    return specifications;
  }

  loadAnalysisInfos(analysisInfos: string[]): void {
    this.analysisInfos = analysisInfos.map(curr => [curr, false]);
    this.componentsLoaded += 1;
  }

  loadKeys(keys: string[]): void {
    this.keys = keys;
    this.componentsLoaded += 1;
  }
}
