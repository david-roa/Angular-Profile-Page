import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPost } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentPost;
  let fixture: ComponentFixture<CommentPost>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentPost ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
