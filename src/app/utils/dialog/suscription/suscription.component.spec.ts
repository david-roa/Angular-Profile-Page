import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Suscription } from './suscription.component';

describe('Suscription', () => {
  let component: Suscription;
  let fixture: ComponentFixture<Suscription>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Suscription ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Suscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
