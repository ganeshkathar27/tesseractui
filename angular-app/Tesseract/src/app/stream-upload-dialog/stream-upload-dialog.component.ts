import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigrationPropertyEditorComponent } from '../configration-property-editor/configration-property-editor.component';
import { MatDialogRef } from '@angular/material';
import { CoreFetcherService } from '../services/core-fetcher/core-fetcher.service';
import { Configration } from '../specs/analysis-configration';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stream-upload-dialog',
  templateUrl: './stream-upload-dialog.component.html',
  styleUrls: ['./stream-upload-dialog.component.css']
})
export class StreamUploadDialogComponent implements OnInit {

  @ViewChild('streamConfigPropertyEditor', {static: true}) streamConfigPropertyEditor: ConfigrationPropertyEditorComponent;

  streamsData;
  streamTypes: string[];
  selectedStreamType: string;
  isLoaded: boolean = false;
  errorMessage;

  constructor(private dialogRef: MatDialogRef<StreamUploadDialogComponent>,
    private fetcherService: CoreFetcherService) { }

  ngOnInit() {
    this.fetcherService.getAllStreamConfigs().subscribe(
      streamConfigs => {
        this.streamsData = streamConfigs;
        this.streamTypes = Object.keys(this.streamsData);
        this.isLoaded = true;
      },
      error => {
        close();
        throw error;
      });
  }

  close() {
    this.dialogRef.close();
  }

  getStreamConfigs() {
    if (this.selectedStreamType == null)
      return null;
    return this.streamsData[this.selectedStreamType];
  }

  isStreamConfigPropertyEntered() {
    return this.streamConfigPropertyEditor.isAllPropertyEntered();
  }

  saveStream() {
    this.isLoaded = false;
    let config: Configration = new Configration();
    config.properties = this.streamConfigPropertyEditor.buildProperties();
    this.fetcherService.saveStream(this.selectedStreamType, config).subscribe(
      _ => {
        this.isLoaded = true;
      },
      error => {
        this.isLoaded = true;
        this.errorMessage = error.message;
        if (error instanceof HttpErrorResponse && error.status == 499)
          this.errorMessage = error.error.message;
      }
    );
  }
}
