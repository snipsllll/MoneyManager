import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEintragComponent } from './edit-eintrag.component';

describe('EditEintragComponent', () => {
  let component: EditEintragComponent;
  let fixture: ComponentFixture<EditEintragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEintragComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEintragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
