import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnalysisSuiteDialogComponent } from './add-analysis-suite-dialog.component';

describe('AddAnalysisSuiteDialogComponent', () => {
  let component: AddAnalysisSuiteDialogComponent;
  let fixture: ComponentFixture<AddAnalysisSuiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnalysisSuiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnalysisSuiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
