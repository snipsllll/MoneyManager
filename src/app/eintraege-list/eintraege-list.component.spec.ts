import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EintraegeListComponent } from './eintraege-list.component';

describe('EintraegeListComponent', () => {
  let component: EintraegeListComponent;
  let fixture: ComponentFixture<EintraegeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EintraegeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EintraegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
