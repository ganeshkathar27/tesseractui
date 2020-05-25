import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelInfo } from '../specs/model-info';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { CoreEventEmitterService } from '../services/core-event-emiter/core-event-emitter.service';
import { MetadataDialogComponent } from '../metadata-dialog/metadata-dialog.component';
import { DataKey } from '../specs/data-key';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-model',
  templateUrl: './manage-model.component.html',
  styleUrls: ['./manage-model.component.css']
})
export class ManageModelComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  isLoaded = false;
  displayedColumns: string[] = ['name', 'status', 'stats', 'delete'];
  modelData: MatTableDataSource<ModelInfo>;

  constructor(private dialogRef: MatDialogRef<ManageModelComponent>,
    private fetcherService: CoreFetcherService,
    private emitterService: CoreEventEmitterService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this.fetcherService.getModelInfo().subscribe(modelInfos => {
      this.modelData = new MatTableDataSource(modelInfos);
      this.modelData.paginator = this.paginator;
      this.isLoaded = true;
    }, err => {
      this.dialogRef.close();
      throw err;
    });
  }

  viewMetadata(element: ModelInfo) {
    if (element.metadata.elements.length == 0) {
      this.emitterService.emitMessageEvent("No metadata present for above analysis")
      return
    }
    this.dialog.open(MetadataDialogComponent, {
      width: '1000px',
      autoFocus: false,
      data: {
        analysisMetadata: [{
          dataKey: new DataKey(element.configurations.properties["DATA_KEY"]),
          analysisType: element.analysisType,
          elements: element.metadata
        }]
      }
    });
  }

  delete(element: ModelInfo) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '750px',
      data: {
        message: 'Are you sure you want to delete this model?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.isLoaded = false;
        this.fetcherService.deleteModel(element.modelName).subscribe(() => {
          this.emitterService.emitMessageEvent("Model deleted successfully !!")
          this.refresh();
        });
      }
    });
  }
}
