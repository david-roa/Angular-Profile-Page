import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUser } from './info-user.component';

describe('InfoUser', () => {
  let component: InfoUser;
  let fixture: ComponentFixture<InfoUser>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoUser ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
