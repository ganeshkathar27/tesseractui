import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnalysisSuitesDialogComponent } from './manage-analysis-suites-dialog.component';

describe('ManageAnalysisSuitesDialogComponent', () => {
  let component: ManageAnalysisSuitesDialogComponent;
  let fixture: ComponentFixture<ManageAnalysisSuitesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAnalysisSuitesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAnalysisSuitesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
