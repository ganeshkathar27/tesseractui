import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainModelDialogComponent } from './train-model-dialog.component';

describe('TrainModelDialogComponent', () => {
  let component: TrainModelDialogComponent;
  let fixture: ComponentFixture<TrainModelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainModelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
