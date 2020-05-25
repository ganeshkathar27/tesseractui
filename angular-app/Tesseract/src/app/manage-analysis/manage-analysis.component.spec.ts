import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnalysisComponent } from './manage-analysis.component';

describe('ManageAnalysisComponent', () => {
  let component: ManageAnalysisComponent;
  let fixture: ComponentFixture<ManageAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
