import { Component, OnInit } from '@angular/core';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { AnalysisSuite } from '../specs/analysis-suite';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ManageAnalysisComponent } from '../manage-analysis/manage-analysis.component';
import { AddAnalysisSuiteDialogComponent } from '../add-analysis-suite-dialog/add-analysis-suite-dialog.component';
import { CoreEventEmitterService } from '../services/core-event-emiter/core-event-emitter.service';

@Component({
  selector: 'app-manage-analysis-suites-dialog',
  templateUrl: './manage-analysis-suites-dialog.component.html',
  styleUrls: ['./manage-analysis-suites-dialog.component.css']
})
export class ManageAnalysisSuitesDialogComponent implements OnInit {

  isLoaded = false;
  analysisSuites: AnalysisSuite[] = [];
  displayedColumns: string[] = ['suiteName', 'analysisType', 'dataKeys', 'status', 'download', 'delete'];

  constructor(private dialogRef: MatDialogRef<ManageAnalysisSuitesDialogComponent>,
    private fetcherService: CoreFetcherService,
    private emitterService: CoreEventEmitterService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchAnalysisSuites();
  }

  fetchAnalysisSuites() {
    this.isLoaded = false;
    this.fetcherService.getAllAnalysisSuites().subscribe(
      (suites) => {
        this.analysisSuites = suites;
        this.isLoaded = true;
      },
      err => {
        this.dialogRef.close();
        throw err;
      }
    );
  }

  openAnalysisInSuite(suiteName: string) {
    this.dialog.open(ManageAnalysisComponent, {
      width: '1500px',
      autoFocus: false,
      data: {
        suiteName: suiteName
      }
    });
  }

  openAddAnalysisSuiteDialog() {
    let dialogRef = this.dialog.open(AddAnalysisSuiteDialogComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(_ => this.fetchAnalysisSuites());
  }

  deleteSuite(suite: AnalysisSuite) {
    this.isLoaded = false;
    this.fetcherService.deleteAnalysisSuite(suite.suiteName).subscribe(
      () => {
        this.fetchAnalysisSuites();
        this.isLoaded = true;
        this.emitterService.emitMessageEvent("Suite deleted successfully");
      },
      err => {
        this.fetchAnalysisSuites();
        this.isLoaded = true;
        throw err;
      });
  }

  downloadSuite(suite: AnalysisSuite) {
    this.isLoaded = false;
    this.fetcherService.downloadAnalysisSuiteAsCSV(suite.suiteName)
      .subscribe((fileName) => {
        this.emitterService.emitMessageEvent("File will be downloaded and stored at : " + fileName);
        this.isLoaded = true;
      });
  }
}
