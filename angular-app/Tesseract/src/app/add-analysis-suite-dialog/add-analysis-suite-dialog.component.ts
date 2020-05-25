import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { MatDialogRef } from '@angular/material';
import { SelectorWrapperComponent } from '../selector-wrapper/selector-wrapper.component';
import { ConfigKey } from '../specs/config-key';
import { AnalysisSuite } from '../specs/analysis-suite';
import { ConfigrationPropertyEditorComponent } from '../configration-property-editor/configration-property-editor.component';
import { Configration } from '../specs/analysis-configration';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-analysis-suite-dialog',
  templateUrl: './add-analysis-suite-dialog.component.html',
  styleUrls: ['./add-analysis-suite-dialog.component.css']
})
export class AddAnalysisSuiteDialogComponent implements OnInit {

  @ViewChild('dataKeySelector', {static: false}) dataKeySelector: SelectorWrapperComponent;
  @ViewChild('configPropertyEditor', {static: false}) configSelector: ConfigrationPropertyEditorComponent;

  componentsLoaded: number = 0;
  keys: string[] = [];
  analysisInfos: string[] = [];
  selectedAnalysis: string;
  selectedAnalysisConfigKeys: ConfigKey[];
  suiteName: string;
  isLoaded: boolean = false;
  errorMessage: string;

  constructor(public dialogRef: MatDialogRef<AddAnalysisSuiteDialogComponent>,
    public fetcherService: CoreFetcherService) { }

  ngOnInit() {
    this.fetchDataKeys();
    this.fetchAnalysisInfos();
  }

  isDataKeySelected() {
    if (this.dataKeySelector) {
      return this.dataKeySelector.isSomethingSelected();
    }
    return false;
  }

  fetchDataKeys() {
    this.fetcherService.getTimeSeriesDataKeys().subscribe(
      dataKeys => {
        this.keys = dataKeys
        this.componentsLoaded += 1;
      },
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  fetchAnalysisInfos() {
    this.fetcherService.getTimeSeriesAnalysisInfos().subscribe(
      analysisInfos => {
        this.analysisInfos = analysisInfos;
        this.componentsLoaded += 1;
      },
      err => {
        this.dialogRef.close();
        throw err;
      }
    )
  }

  fetchConfigs() {
    this.fetcherService.getRequiredConfigurations([this.selectedAnalysis]).subscribe(
      values => {
        this.selectedAnalysisConfigKeys = values[this.selectedAnalysis]
        this.selectedAnalysisConfigKeys.forEach(key => {
          key.useDefaultValue = true;
          key.currValue = key.defaultValue;
        })
      },
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  runAnalysisSuite() {
    this.isLoaded = false;
    let config = new Configration();
    config.properties = this.configSelector.buildProperties();
    let analysSuite: AnalysisSuite = new AnalysisSuite(this.suiteName, this.selectedAnalysis, this.dataKeySelector.getSelectedKey(), config);

    this.fetcherService.runAnalysisSuite(analysSuite).subscribe(
      _ => {
        this.isLoaded = true;
      },
      error => {
        this.isLoaded = true;
        this.errorMessage = error.message;
        if (error instanceof HttpErrorResponse && error.status == 499)
          this.errorMessage = error.error.message;
      }
    );;
  }
}
