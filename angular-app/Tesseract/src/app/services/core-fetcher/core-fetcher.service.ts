import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';

import { timeSeriesDatakeysUrl, timeSeriesAnalysisInfosUrl, runAnalysisUrl, dataInfoURL, modelInfoURL, requiredAnalysisUrl, allSourceUrl, getDataConfigurationUrl, uploadDataUrl, fileUploadUrl, allStreamConfigUrl, saveStreamUrl, streamkeysUrl, analyzeStreamUrl, readStreamUrl, streamSupportedanalysisInfosUrl, stopStreamUrl, exportAnalysisUrl, uploadDataProgressUrl, allAnalysisSuitesUrl, runAnalysisSuiteUrl, getAnalysisUrl, analysisSuiteUrl, analysisSuiteCsvUrl, customColumnUrl, dashboardUrl, dashboardsUrl, accessibleFeaturesUrl, dataUrl, streamUrl, predictiveAnalysisInfosUrl, trainModelUrl, modelUrl } from './http.constants';
import { AnalysisResult } from '../../specs/analysis-result';
import { DataInfo } from '../../specs/data-info';
import { AnalysisSpecification } from '../../specs/analysis-specification';
import { Configration } from '../../specs/analysis-configration';
import { ConfigKey } from '../../specs/config-key';
import { StreamingSpecification } from '../../specs/stream-specification';
import { StreamIdentifier } from '../../specs/stream-identifier';
import { DataKey } from '../../specs/data-key';
import { AnalysisSuite } from '../../specs/analysis-suite';
import { AnalysisInfo } from '../../specs/analysis-info';
import { ModelSpecification } from '../../specs/model-specification';
import { ModelInfo } from '../../specs/model-info';

@Injectable()
export class CoreFetcherService {
  private token: string;

  constructor(private http: HttpClient) { }

  private getDefaultOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Id-Token': this.token
      })
    };
  }

  setUser(token: string) {
    this.token = token;
  }
  
  getAccessibleFeatures() {
    return this.http.get<string[]>(accessibleFeaturesUrl, this.getDefaultOptions());
  }

  getAllSources(): Observable<{ [source: string]: ConfigKey[] }> {
    return this.http.get<{ [source: string]: ConfigKey[] }>(allSourceUrl, this.getDefaultOptions());
  }

  getAllStreamConfigs(): Observable<{ [stream: string]: ConfigKey[] }> {
    return this.http.get<{ [stream: string]: ConfigKey[] }>(allStreamConfigUrl, this.getDefaultOptions());
  }

  getDataConfigurations(source: string, sourceConfigration: Configration) {
    let url = getDataConfigurationUrl + "/" + source;
    return this.http.post<ConfigKey[]>(url, sourceConfigration, this.getDefaultOptions());
  }

  getTimeSeriesDataKeys(): Observable<string[]> {
    return this.http.get<string[]>(timeSeriesDatakeysUrl, this.getDefaultOptions());
  }

  getStreamKeys(): Observable<string[]> {
    return this.http.get<string[]>(streamkeysUrl, this.getDefaultOptions());
  }

  getTimeSeriesAnalysisInfos(): Observable<string[]> {
    return this.http.get<string[]>(timeSeriesAnalysisInfosUrl, this.getDefaultOptions());
  }

  getPredictiveAnalysisInfos(): Observable<string[]> {
    return this.http.get<string[]>(predictiveAnalysisInfosUrl, this.getDefaultOptions());
  }

  getDataInfo(): Observable<DataInfo[]> {
    return this.http.get<DataInfo[]>(dataInfoURL, this.getDefaultOptions());
  }

  getModelInfo(): Observable<ModelInfo[]> {
    return this.http.get<ModelInfo[]>(modelInfoURL, this.getDefaultOptions());
  }

  getStreamSupportedAnalysisInfos(): Observable<string[]> {
    return this.http.get<string[]>(streamSupportedanalysisInfosUrl, this.getDefaultOptions());
  }

  uploadData(source: string, configration: Configration) {
    let url = uploadDataUrl + "/" + source;
    return this.http.post(url, configration, this.getDefaultOptions())
  }

  uploadDataProgress(dataKey: DataKey) {
    let url = uploadDataProgressUrl;
    return this.http.post<number>(url, dataKey, this.getDefaultOptions())
  }

  addCustomColumn(dataKey: DataKey, columnName: string, expression: string) {
    let data = {
      dataKey: dataKey.key,
      columnName: columnName,
      expression: expression
    };
    return this.http.post(customColumnUrl, data, this.getDefaultOptions())
  }

  saveStream(streamType: string, configration: Configration) {
    let url = saveStreamUrl + "/" + streamType;
    return this.http.post<ConfigKey[]>(url, configration, this.getDefaultOptions())
  }

  saveDashboard(name: string, data: any) {
    let url = dashboardUrl + "/" + name;
    return this.http.post(url, data, this.getDefaultOptions())
  }

  getAllDashboards() {
    return this.http.get<string[]>(dashboardsUrl, this.getDefaultOptions())
  }

  getDashoardData(name) {
    let url = dashboardUrl + "/" + name;
    return this.http.get<any>(url, this.getDefaultOptions())
  }

  trainModel(modelSpecification: ModelSpecification) {
    return this.http.post<AnalysisResult[]>(trainModelUrl, modelSpecification, this.getDefaultOptions());
  }

  runAnalysis(analysisSpecifications: AnalysisSpecification[]): Observable<AnalysisResult[]> {
    return this.http.post<AnalysisResult[]>(runAnalysisUrl, analysisSpecifications, this.getDefaultOptions());
  }

  runAnalysisSuite(analysisSuite: AnalysisSuite) {
    return this.http.post(runAnalysisSuiteUrl, analysisSuite, this.getDefaultOptions());
  }

  analyzeStream(streamsSpecification: StreamingSpecification[]): Observable<StreamIdentifier[]> {
    return this.http.post<StreamIdentifier[]>(analyzeStreamUrl, streamsSpecification, this.getDefaultOptions());
  }

  readStream(streamId: StreamIdentifier): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(readStreamUrl, streamId, this.getDefaultOptions());
  }

  stopStream(streamId: StreamIdentifier) {
    return this.http.post<AnalysisResult>(stopStreamUrl, streamId, this.getDefaultOptions());
  }

  getRequiredConfigurations(analysisTypes: string[]): Observable<{ [analysisType: string]: ConfigKey[] }> {
    return this.http.post<{ [analysisType: string]: ConfigKey[] }>(requiredAnalysisUrl, analysisTypes, this.getDefaultOptions());
  }

  getAllAnalysisSuites() {
    return this.http.get<AnalysisSuite[]>(allAnalysisSuitesUrl, this.getDefaultOptions());
  }

  getAnalysisInSuite(suiteName: string) {
    let url = getAnalysisUrl + "/" + suiteName;
    return this.http.get<AnalysisInfo[]>(url, this.getDefaultOptions());
  }

  deleteAnalysisSuite(suiteName: string) {
    let url = analysisSuiteUrl + "/" + suiteName;
    return this.http.delete(url, this.getDefaultOptions());
  }

  deleteData(dataKey: DataKey) {
    let url = dataUrl + "/" + dataKey.key;
    return this.http.delete(url, this.getDefaultOptions());
  }

  deleteModel(modeName: string) {
    let url = modelUrl + "/" + modeName;
    return this.http.delete(url, this.getDefaultOptions());
  }

  deleteDashboard(name: string) {
    let url = dashboardUrl + "/" + name;
    return this.http.delete(url, this.getDefaultOptions());
  }

  deleteStream(name: string) {
    let url = streamUrl + "/" + name;
    return this.http.delete(url, this.getDefaultOptions());
  }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    let req = new HttpRequest('POST', fileUploadUrl, formdata, {
      responseType: 'text',
      headers: new HttpHeaders({ 'Id-Token': this.token })
    });
    return this.http.request(req);
  }

  exportAsCSV(specs: AnalysisSpecification[]) {
    this.http.post<string[]>(exportAnalysisUrl, specs, this.getDefaultOptions()).subscribe(
      csvData => {
        var a = document.createElement('a');
        document.body.appendChild(a);
        csvData.forEach((element, index) => {
          let nameOfFileToDownload = specs[index].dataKey.key + "-" + specs[index].analysisType + ".csv"
          var blob = new Blob([element], {
            type: "text/csv"
          });
          a.href = window.URL.createObjectURL(blob);
          a.download = nameOfFileToDownload;
          a.click();
        });
        document.body.removeChild(a);
      }
    );
  }

  downloadAnalysisSuiteAsCSV(suiteName: string) {
    let url = analysisSuiteCsvUrl + "/" + suiteName;
    return this.http.get(url, { ...this.getDefaultOptions(), responseType: 'text' })
  }
}
