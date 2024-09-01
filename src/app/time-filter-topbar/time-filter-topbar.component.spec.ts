import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFilterTopbarComponent } from './time-filter-topbar.component';

describe('TimeFilterTopbarComponent', () => {
  let component: TimeFilterTopbarComponent;
  let fixture: ComponentFixture<TimeFilterTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeFilterTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFilterTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
