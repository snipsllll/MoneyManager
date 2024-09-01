import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEintragComponent } from './create-eintrag.component';

describe('CreateEintragComponent', () => {
  let component: CreateEintragComponent;
  let fixture: ComponentFixture<CreateEintragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEintragComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEintragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
