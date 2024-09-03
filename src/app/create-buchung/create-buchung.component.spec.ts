import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuchungComponent } from './create-buchung.component';

describe('CreateEintragComponent', () => {
  let component: CreateBuchungComponent;
  let fixture: ComponentFixture<CreateBuchungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBuchungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBuchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
