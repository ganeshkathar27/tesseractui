import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AnalysisSpecification } from "../specs/analysis-specification";
import { ConfigKey } from "../specs/config-key";
import { CoreFetcherService } from "../services/core-fetcher/core-fetcher.service";
import { ConfigrationPropertyEditorComponent } from "../configration-property-editor/configration-property-editor.component";
import { DataKey } from "../specs/data-key";
import { DataInfo } from "../specs/data-info";
import { AnalysisService } from "../services/analysis-service/analysis-service.service";

@Component({
  selector: 'app-configration-dialog',
  templateUrl: './configration-dialog.component.html',
  styleUrls: ['./configration-dialog.component.css']
})
export class ConfigrationDialogComponent implements OnInit {

  @ViewChild('propertyEditor', { static: false }) propertyEditor: ConfigrationPropertyEditorComponent;
  analysisSpecifications: AnalysisSpecification[];
  analysisTypeVsdefaultValues: { [analysisType: string]: ConfigKey[] };
  selectedIndex: number;
  selectedAnalysisConfigKeys: ConfigKey[];
  isLoaded: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfigrationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fetcherService: CoreFetcherService,
    private analysisService: AnalysisService) {
    this.analysisSpecifications = data.analysisSpecifications;
    let analysisTypes = this.analysisSpecifications.map(spec => spec.analysisType);
    fetcherService.getRequiredConfigurations(analysisTypes).subscribe(
      values => {
        this.analysisTypeVsdefaultValues = values;
        this.isLoaded = true;
      },
      err => {
        this.isLoaded = true;
        this.dialogRef.close();
        throw err;
      }
    );
  }

  ngOnInit() {
  }

  saveConfigs() {
    let modifiedProperties = this.propertyEditor.buildProperties();
    let properties = this.analysisSpecifications[this.selectedIndex].configurations.properties
    if (!properties)
      properties = {};
    this.analysisSpecifications[this.selectedIndex].configurations.properties = { ...properties, ...modifiedProperties };
    this.dialogRef.close(this.analysisSpecifications);
  }

  onSelectAnalysis(analysisSpecSelected: AnalysisSpecification) {
    let configKeysRequired = this.analysisTypeVsdefaultValues[analysisSpecSelected.analysisType];
    this.selectedAnalysisConfigKeys = [];
    this.analysisService.fillDetailsinConfigKeys(configKeysRequired, analysisSpecSelected.dataKey, analysisSpecSelected.configurations.properties);
    configKeysRequired.forEach(key => {
      this.selectedAnalysisConfigKeys.push(key)
    });
    this.selectedIndex = this.analysisSpecifications.indexOf(analysisSpecSelected);
  }
}
