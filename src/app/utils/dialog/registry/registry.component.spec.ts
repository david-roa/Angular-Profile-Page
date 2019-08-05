import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Registry } from './registry.component';

describe('Registry', () => {
  let component: Registry;
  let fixture: ComponentFixture<Registry>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Registry ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Registry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
