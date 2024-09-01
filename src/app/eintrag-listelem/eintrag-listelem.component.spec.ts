import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EintragListelemComponent } from './eintrag-listelem.component';

describe('EintragListelemComponent', () => {
  let component: EintragListelemComponent;
  let fixture: ComponentFixture<EintragListelemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EintragListelemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EintragListelemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
