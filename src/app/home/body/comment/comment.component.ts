import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comment } from 'src/app/model/profile/comment';
import { PostService } from '../../../services/app/profile/post.service';

export interface DialogData {
  post;
  user: string;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentPost implements OnInit {

  public message: string = '';
  constructor(
    public dialogRef: MatDialogRef<CommentPost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ps: PostService
  ) { }

  ngOnInit() {}

  commentPost() {
    var comment: Comment = new Comment();
    comment.user = this.data.user;
    comment.message = this.message;
    if (this.data.post.comments == undefined)
      this.data.post.comments = [];
    this.data.post.comments.push(comment)
    this.ps.updateItem(this.data.post.key, this.data.post);
    this.dialogRef.close();
  }

}
