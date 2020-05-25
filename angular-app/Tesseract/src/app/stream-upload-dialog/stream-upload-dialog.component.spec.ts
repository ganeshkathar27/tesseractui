import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamUploadDialogComponent } from './stream-upload-dialog.component';

describe('StreamUploadDialogComponent', () => {
  let component: StreamUploadDialogComponent;
  let fixture: ComponentFixture<StreamUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
