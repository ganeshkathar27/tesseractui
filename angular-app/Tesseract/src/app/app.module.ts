import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';

import { MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatNativeDateModule, MatSelectModule, MatSnackBarModule, MatStepperModule, MatSortModule, MatRippleModule, MatSlideToggleModule, MatTabsModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NouisliderModule } from 'ng2-nouislider';
import { GridsterModule } from 'angular-gridster2';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { ConfigrationDialogComponent } from './configration-dialog/configration-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreFetcherService } from './services/core-fetcher/core-fetcher.service';
import { HttpClientModule } from '@angular/common/http';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { CanvasComponent } from './canvas/canvas.component';
import { AnalysisDashboardComponent } from './analysis-dashboard/analysis-dashboard.component';
import { TimeseriesChartWidgetComponent } from './widgets/timeseries-chart-widget/timeseries-chart-widget.component';
import { CoreEventEmitterService } from './services/core-event-emiter/core-event-emitter.service';
import { AddAnalysisDialogComponent } from './add-analysis-dialog/add-analysis-dialog.component';
import { ConfigrationPropertyEditorComponent } from './configration-property-editor/configration-property-editor.component';
import { GlobalErrorHandler } from './app.error-handler';
import { DataUploadDialogComponent } from './data-upload-dialog/data-upload-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StreamUploadDialogComponent } from './stream-upload-dialog/stream-upload-dialog.component';
import { ExportAnalysisDialogComponent } from './export-analysis-dialog/export-analysis-dialog.component';
import { MetadataDialogComponent } from './metadata-dialog/metadata-dialog.component';
import { DialChartComponent } from './dial-chart/dial-chart.component';
import { BasicChartComponent } from './basic-chart/basic-chart.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { ManageAnalysisSuitesDialogComponent } from './manage-analysis-suites-dialog/manage-analysis-suites-dialog.component';
import { SelectorWrapperComponent } from './selector-wrapper/selector-wrapper.component';
import { AddAnalysisSuiteDialogComponent } from './add-analysis-suite-dialog/add-analysis-suite-dialog.component';
import { ManageAnalysisComponent } from './manage-analysis/manage-analysis.component';
import { BasicChartWidgetComponent } from './widgets/basic-chart-widget/basic-chart-widget.component';
import { GenericWidgetDialogComponent } from './widgets/generic-widget-dialog/generic-widget-dialog.component';
import { SliceWidgetComponent } from './widgets/slice-widget/slice-widget.component';
import { SlicePanelComponent } from './slice-panel/slice-panel.component';
import { AddCustomColumnDialogComponent } from './add-custom-column-dialog/add-custom-column-dialog.component';
import { DataValueWidgetComponent } from './widgets/data-value-widget/data-value-widget.component';
import { DialWidgetComponent } from './widgets/dial-widget/dial-widget.component';
import { ChartOptionsDialogComponent } from './chart-options-dialog/chart-options-dialog.component';
import { HumanizePipe } from './pipes/humanize';
import { ImageWidgetComponent } from './widgets/image-widget/image-widget.component';
import { SimpleInputDialogComponent } from './simple-input-dialog/simple-input-dialog.component';
import { EditTabsDialogComponent } from './edit-tabs-dialog/edit-tabs-dialog.component';
import { SliceOptionsDialogComponent } from './slice-options-dialog/slice-options-dialog.component';
import { AuthorisationService } from './services/authorisation-service/authorisation-service.service';
import { LoginComponent } from './login/login.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './services/authorisation-service/auth-guard.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ManageEntitiesComponent } from './manage-entities/manage-entities.component';
import { ManageDashboardComponent } from './manage-dashboard/manage-dashboard.component';
import { ManageStreamComponent } from './manage-stream/manage-stream.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { DataTableWidgetComponent } from './widgets/data-table-widget/data-table-widget.component';
import { GeoMapWidgetComponent } from './widgets/geo-map-widget/geo-map-widget.component';
import { TrainModelDialogComponent } from './train-model-dialog/train-model-dialog.component';
import { ManageModelComponent } from './manage-model/manage-model.component';
import { StaticTextWidgetComponent } from './widgets/static-text-widget/static-text-widget.component';
import { MatExpansionModule } from '@angular/material/expansion';

export function getAppName() {
  return 'Tesseract';
}

@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    ConfigrationDialogComponent,
    ProgressIndicatorComponent,
    CanvasComponent,
    AnalysisDashboardComponent,
    TimeseriesChartWidgetComponent,
    AddAnalysisDialogComponent,
    ConfigrationPropertyEditorComponent,
    DataUploadDialogComponent,
    FileUploadComponent,
    StreamUploadDialogComponent,
    ExportAnalysisDialogComponent,
    MetadataDialogComponent,
    DialChartComponent,
    BasicChartComponent,
    DataTableComponent,
    ManageDataComponent,
    DataTableComponent,
    ManageAnalysisSuitesDialogComponent,
    SelectorWrapperComponent,
    AddAnalysisSuiteDialogComponent,
    ManageAnalysisComponent,
    BasicChartWidgetComponent,
    GenericWidgetDialogComponent,
    SliceWidgetComponent,
    SlicePanelComponent,
    AddCustomColumnDialogComponent,
    DataValueWidgetComponent,
    DialWidgetComponent,
    ChartOptionsDialogComponent,
    HumanizePipe,
    ImageWidgetComponent,
    SimpleInputDialogComponent,
    EditTabsDialogComponent,
    SliceOptionsDialogComponent,
    LoginComponent,
    ConfirmDialogComponent,
    ManageEntitiesComponent,
    ManageDashboardComponent,
    ManageStreamComponent,
    ShowcaseComponent,
    DataTableWidgetComponent,
    GeoMapWidgetComponent,
    TrainModelDialogComponent,
    ManageModelComponent,
    StaticTextWidgetComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatStepperModule,
    GridsterModule,
    MatTableModule,
    MatProgressBarModule,
    MatRadioModule,
    NgSelectModule,
    MatPaginatorModule,
    MatSortModule,
    NouisliderModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxAuthFirebaseUIModule.forRoot(environment.firebase, getAppName,
      {
        toastMessageOnAuthSuccess: true,
        toastMessageOnAuthError: false,
        guardProtectedRoutesUntilEmailIsVerified: true
      }),
    AppRoutingModule,
    MatTooltipModule
  ],
  entryComponents: [
    ConfigrationDialogComponent,
    AddAnalysisDialogComponent,
    GenericWidgetDialogComponent,
    DataUploadDialogComponent,
    StreamUploadDialogComponent,
    ExportAnalysisDialogComponent,
    MetadataDialogComponent,
    ManageAnalysisSuitesDialogComponent,
    AddAnalysisSuiteDialogComponent,
    ManageAnalysisComponent,
    AddCustomColumnDialogComponent,
    ChartOptionsDialogComponent,
    SimpleInputDialogComponent,
    EditTabsDialogComponent,
    SliceOptionsDialogComponent,
    ConfirmDialogComponent,
    ManageEntitiesComponent,
    TrainModelDialogComponent
  ],
  providers: [
    CoreFetcherService,
    AuthorisationService,
    AuthGuardService,
    CoreEventEmitterService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
