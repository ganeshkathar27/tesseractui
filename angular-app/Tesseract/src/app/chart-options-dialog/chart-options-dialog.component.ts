import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-chart-options-dialog',
  templateUrl: './chart-options-dialog.component.html',
  styleUrls: ['./chart-options-dialog.component.css']
})
export class ChartOptionsDialogComponent implements OnInit {
  Object = Object;
  options: {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChartOptionsDialogComponent>) {
    this.options = {}
    Object.values(data.customOptions).forEach(element => {
      let group = element["group"];
      if (!this.options[group])
        this.options[group] = [];
      this.options[group].push(element);
    });;
  }

  ngOnInit() {
  }

  saveOptions() {
  }
}
