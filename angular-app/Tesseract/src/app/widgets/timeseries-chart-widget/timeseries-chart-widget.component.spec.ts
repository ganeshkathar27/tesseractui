import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesChartWidgetComponent } from './timeseries-chart-widget.component';

describe('TimeseriesChartWidgetComponent', () => {
  let component: TimeseriesChartWidgetComponent;
  let fixture: ComponentFixture<TimeseriesChartWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesChartWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
