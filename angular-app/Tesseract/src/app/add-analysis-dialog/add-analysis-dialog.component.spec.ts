import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnalysisDialogComponent } from './add-analysis-dialog.component';

describe('AddAnalysisDialogComponent', () => {
  let component: AddAnalysisDialogComponent;
  let fixture: ComponentFixture<AddAnalysisDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnalysisDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnalysisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
