import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmButtonComponent } from './mm-button.component';

describe('MmButtonComponent', () => {
  let component: MmButtonComponent;
  let fixture: ComponentFixture<MmButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MmButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
