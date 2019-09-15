import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadImage } from './upload/Image/upload-image.component';
import { UploadFilePost } from './upload/file/upload-file.component';
import { Comment } from 'src/app/model/profile/comment';
import FroalaEditor from 'froala-editor';
import { map } from 'rxjs/operators';
import { User } from '../../model/app/user';
import { Post } from '../../model/profile/post';
import { Attached } from '../../model/profile/atteched';
import { Image } from '../../model/profile/image';
import { PostService } from '../../services/app/profile/post.service';
import { TokenService } from '../../services/app/auth/token.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {
  public options = {};
  panelOpenState = false;
  file: File;
  postTemp: string;
  limitFiles = false;
  limitImg = false;
  user = '';
  inTempPost: number = new Date().getTime();
  date: Date = new Date();
  imgProfile = '../../../assets/image/user.gif';
  viewFroala = true;
  nameEditor = '';
  commentTemp = '';

  public testListComments: Comment[] = [];
  public users: User[] = [];
  public posts: Post[] = [];
  public images: Image[] = [];
  public attachments: Attached[] = [];


  constructor(public dialog: MatDialog, private ps: PostService, private af: AngularFireAuth, private ts: TokenService) {
    this.file = new File(new Array<Blob>(), 'Mock');
    this.initFroala();
    this.showFroala();
  }

  async ngOnInit() {
    this.af.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.emailVerified || user.providerData[0].providerId.includes('facebook') ? user.displayName : '';
        this.imgProfile = user.emailVerified || user.providerData[0].providerId.includes('facebook') ? user.photoURL : '../../../assets/image/user.gif';
      } else {
        this.user = '';
        this.imgProfile = '../../../assets/image/user.gif';
      }
    });
    await this.ps.getPost().snapshotChanges().pipe(
      map(actions => actions.map(a => ({ key: a.payload.key, ...a.payload.val() })))
    ).subscribe(items => this.posts = items.reverse());
    await this.ts.getUsers().snapshotChanges().pipe(
      map(actions => actions.map(a => ({ key: a.payload.key, ...a.payload.val() })))
    ).subscribe(items => this.users = items.reverse());
  }

  openComments() {
    this.panelOpenState = !this.panelOpenState;
  }

  uploadImg() {
    const dialogRef = this.dialog.open(UploadImage, {
      width: '350px', height: '320px',
      data: { file: this.file }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        this.file = result;
        const url = await this.ps.uploadFilePost(this.file, this.inTempPost, this.images.length);
        const image: Image = new Image();
        image.name = this.file.name;
        image.url = url;
        this.images.push(image);
      }
      if (this.images.length < 10) {
      } else {
        this.limitImg = true;
      }
    });
  }

  uploadFile() {
    const dialogRef = this.dialog.open(UploadFilePost, {
      width: '350px', height: '320px',
      data: { file: this.file }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        this.file = result;
        const url = await this.ps.uploadFilePost(this.file, this.inTempPost, this.attachments.length);
        const attachment: Attached = new Attached();
        attachment.name = this.file.name;
        attachment.ext = this.file.name.split('.')[1];
        attachment.url = url;
        this.attachments.push(attachment);
      }
      if (this.attachments.length < 4) {
      } else {
        this.limitFiles = true;
      }
    });
  }

  deletePostTemp() {
    this.ps.deleteFilesTemp(this.images, this.attachments)
    this.limitImg = null;
    this.limitFiles = null;
    this.images = [];
    this.attachments = [];
    this.postTemp = null;
    console.log(this.users)
  }

  createNewPost() {
    this.af.authState.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        const post: Post = new Post();
        post.user = user.displayName;
        post.text = this.postTemp;
        post.imgProfile = user.photoURL;
        post.images = this.images;
        post.attachments = this.attachments;
        this.ps.createPost(post)
        this.limitImg = null;
        this.limitFiles = null;
        this.posts = [];
        this.images = [];
        this.attachments = [];
        this.postTemp = null;
      }
    })
  }

  initFroala() {
    FroalaEditor.DefineIcon('clear', { NAME: 'trash', SVG_KEY: 'trash' });
    FroalaEditor.RegisterCommand('clear', {
      title: 'Clear HTML',
      focus: false,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.set('');
        this.events.focus();
      }
    });
  }

  showFroala() {
    this.viewFroala = !this.viewFroala;
    if (this.viewFroala) {
      this.nameEditor = 'Editor Clasico!'
      this.options = {
        placeholderText: 'Edita tu Post!',
        immediateAngularModelUpdate: true,
        charCounterCount: true,
        theme: 'dark',
        language: 'es',
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', 'clearFormatting'],
            'buttonsVisible': 1
          },
          'moreParagraph': {
            'buttons': ['align', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
            'buttonsVisible': 1
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertHR'],
            'buttonsVisible': 1
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'clear', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        },
        iconsTemplate: 'font_awesome_5',
        quickInsertButtons: ['table', 'ol', 'ul']
      };
    } else {
      this.nameEditor = 'Editor Froala!';
      this.options = { placeholderText: '' }
    }
  }

  deleteAtt(url, index) {
    this.ps.deleteFileTemp(url);
    this.attachments.splice(index, 1)
    if (this.attachments.length < 4) {
      this.limitFiles = false;
    }
  }

  commentPost(val) {
    this.af.authState.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        var key = val.key;
        var post: Post = val;
        var comment: Comment = new Comment();
        comment.user = this.user;
        comment.imgProfile = user.photoURL;
        comment.message = this.commentTemp;
        if (post.comments == undefined)
          post.comments = [];
        post.comments.push(comment)
        this.ps.updateItem(key, post);
        this.commentTemp = '';
      }
    })
  }
}
