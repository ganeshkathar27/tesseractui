import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { AnalysisInfo } from '../specs/analysis-info';
import { CoreEventEmitterService } from '../services/core-event-emiter/core-event-emitter.service';
import { WidgetSpecification } from '../specs/widget-specification';
import { SourceType } from '../specs/source-type';
import { AnalysisSpecification } from '../specs/analysis-specification';
import { WidgetType } from '../specs/widget-type';
import { AnalysisService } from '../services/analysis-service/analysis-service.service';

@Component({
  selector: 'app-manage-analysis',
  templateUrl: './manage-analysis.component.html',
  styleUrls: ['./manage-analysis.component.css']
})
export class ManageAnalysisComponent implements OnInit {

  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  suiteName: string;
  analysisType: string;
  analysis: MatTableDataSource<AnalysisInfo> = new MatTableDataSource([]);
  isLoaded: boolean = false;
  displayedColumns: string[] = ['dataKey', 'status', 'addToCanvas'];
  metadataHeadersIndexes: {} = {};
  metadataSummary: {} = {};

  constructor(private dialogRef: MatDialogRef<ManageAnalysisComponent>,
    private fetcherService: CoreFetcherService,
    private emitterService: CoreEventEmitterService,
    private analysisService: AnalysisService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.suiteName = data.suiteName
  }

  ngOnInit() {
    this.fetchAnalysis();
  }

  fetchAnalysis() {
    this.isLoaded = false;
    this.fetcherService.getAnalysisInSuite(this.suiteName).subscribe(
      analysis => {
        this.analysis = new MatTableDataSource(analysis);
        this.analysisType = analysis[0].analysisType;
        this.fillMetadataHeadersIndexes(analysis);
        this.handleSortingOfMetadata();
        this.fillMetadataSummary(analysis);
        this.isLoaded = true;
        setTimeout(() => {
          this.analysis.paginator = this.paginator;
          this.analysis.sort = this.sort;
        }, 100);
      },
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  private fillMetadataSummary(analysis: AnalysisInfo[]) {
    let cnt = 0;
    analysis.forEach(ana => {
      if (ana.metadata != null) {
        Object.keys(this.metadataSummary).forEach(element => {
          this.metadataSummary[element] += ana.metadata.elements[this.metadataHeadersIndexes[element]].value;
        });
        cnt += 1;
      }
    });
    Object.keys(this.metadataSummary).forEach(mdkey => {
      if (this.metadataSummary[mdkey] != 0)
        this.metadataSummary[mdkey] /= cnt;
    });
  }

  private handleSortingOfMetadata() {
    this.analysis.sortingDataAccessor = (item, property) => {
      if (property in this.metadataHeadersIndexes)
        return item.metadata.elements[this.metadataHeadersIndexes[property]].value;
      return item[property];
    };
  }

  private fillMetadataHeadersIndexes(analysis: AnalysisInfo[]) {
    let firstIndex = 0;
    for (let i = 0; i < analysis.length; i++) {
      if (analysis[i].resultDataKey != null) {
        firstIndex = i;
        break;
      }
    }
    analysis[firstIndex].metadata.elements.forEach((md, i) => {
      if (md.type == "VALUE") {
        this.displayedColumns.splice(1, 0, md.key);
        this.metadataHeadersIndexes[md.key] = i;
        this.metadataSummary[md.key] = 0;
      }
    });
  }

  addToCanvas(analysisInfo: AnalysisInfo) {
    let spec: AnalysisSpecification = new AnalysisSpecification(analysisInfo.analysisType, analysisInfo.dataKey, analysisInfo.configurations);
    let widgetSpecification: WidgetSpecification = new WidgetSpecification([spec], SourceType.DATA, WidgetType.TIME_SERIES);
    this.analysisService.addAnalysis(widgetSpecification);
  }

  metadataHeadersKeys() {
    return Object.keys(this.metadataHeadersIndexes);
  }

  getAverage(header: string) {
    return this.metadataSummary[header];
  }
}
