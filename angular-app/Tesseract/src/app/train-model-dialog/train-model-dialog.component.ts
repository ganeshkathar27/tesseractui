import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalysisService } from '../services/analysis-service/analysis-service.service';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { ConfigrationPropertyEditorComponent } from '../configration-property-editor/configration-property-editor.component';
import { ConfigKey } from '../specs/config-key';
import { DataKey } from '../specs/data-key';
import { ModelSpecification } from '../specs/model-specification';
import { Configration } from '../specs/analysis-configration';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-train-model-dialog',
  templateUrl: './train-model-dialog.component.html',
  styleUrls: ['./train-model-dialog.component.css']
})
export class TrainModelDialogComponent implements OnInit {

  dataKeys: string[];
  selectedDataKey: string;
  modelName: string;
  analysis: string[];
  selectedAnalysis: string;
  errorMessage;

  @ViewChild('modelConfigPropertyEditor', { static: true }) modelConfigPropertyEditor: ConfigrationPropertyEditorComponent;
  modelConfigKeys: ConfigKey[];

  isLoaded: boolean = false;

  constructor(private fetcherService: CoreFetcherService, private analysisService: AnalysisService) { }

  ngOnInit() {
    this.dataKeys = this.analysisService.getAllDataKeys();
    this.fetcherService.getPredictiveAnalysisInfos().subscribe(analysisInfos => {
      this.analysis = analysisInfos;
      this.isLoaded = true;
    }, error => {
      close();
      throw error;
    });
  }

  getRequiredAnalysisConfigs() {
    this.isLoaded = false;
    this.fetcherService.getRequiredConfigurations([this.selectedAnalysis]).subscribe(configs => {
      let configKeys = configs[this.selectedAnalysis];
      this.analysisService.fillDetailsinConfigKeys(configKeys, new DataKey(this.selectedDataKey), {});
      this.modelConfigKeys = configKeys;
      this.isLoaded = true;
    });
  }

  isModelConfigPropertyEntered() {
    return this.modelConfigPropertyEditor.isAllPropertyEntered();
  }

  startTrainModel() {
    this.isLoaded = false;
    const config = new Configration();
    config.properties = this.modelConfigPropertyEditor.buildProperties();
    let modelSpec = new ModelSpecification(
      this.modelName,
      this.selectedAnalysis,
      new DataKey(this.selectedDataKey),
      config)
    this.fetcherService.trainModel(modelSpec).subscribe(
      () => {
        this.isLoaded = true;
      },
      error => {
        this.isLoaded = true;
        this.errorMessage = error.message;
        if (error instanceof HttpErrorResponse && error.status == 499)
          this.errorMessage = error.error.message;
      });
  }
}