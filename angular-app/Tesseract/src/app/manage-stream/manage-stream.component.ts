import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-stream',
  templateUrl: './manage-stream.component.html',
  styleUrls: ['./manage-stream.component.css']
})
export class ManageStreamComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  isLoaded = false;
  displayedColumns: string[] = ['name', 'delete'];
  streamData: MatTableDataSource<string>;
  constructor(private dialogRef: MatDialogRef<ManageStreamComponent>,
    private fetcherService: CoreFetcherService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoaded = false;
    this.fetcherService.getStreamKeys().subscribe(
      dashboards => {
        this.streamData = new MatTableDataSource(dashboards);
        this.streamData.paginator = this.paginator;
        this.isLoaded = true;
      },
      err => {
        this.dialogRef.close();
        throw err;
      });
  }

  delete(element: any) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '750px',
      data: {
        message: 'Are you sure you want to delete this stream?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.isLoaded = false;
        this.fetcherService.deleteStream(element).subscribe(() => this.fetchData());
      }
    });
  }

}
