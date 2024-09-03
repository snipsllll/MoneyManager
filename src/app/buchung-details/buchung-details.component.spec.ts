import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungDetailsComponent } from './buchung-details.component';

describe('EintragDetailsComponent', () => {
  let component: BuchungDetailsComponent;
  let fixture: ComponentFixture<BuchungDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuchungDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
