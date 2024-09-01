import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EintragDetailsComponent } from './eintrag-details.component';

describe('EintragDetailsComponent', () => {
  let component: EintragDetailsComponent;
  let fixture: ComponentFixture<EintragDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EintragDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EintragDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
