import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDayComponent } from './list-day.component';

describe('ListDayComponent', () => {
  let component: ListDayComponent;
  let fixture: ComponentFixture<ListDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
