import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadImage } from './upload/Image/upload-image.component';
import { UploadFilePost } from './upload/file/upload-file.component';
import { CommentPost } from './comment/comment.component';
import { SharedService } from '../../services/shared/shared-service.service';
import FroalaEditor from 'froala-editor';
import { map } from 'rxjs/operators';
import { Post } from '../../model/profile/post';
import { Attached } from '../../model/profile/atteched';
import { Image } from '../../model/profile/image';
import { PostService } from '../../services/app/profile/post.service';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit, AfterViewInit {
  public options: Object = {}
  panelOpenState = false;
  file: File;
  postTemp: string;
  limitFiles: boolean = false;
  limitImg: boolean = false;
  user: string;
  inTempPost: number = new Date().getTime();
  date: Date = new Date();
  imgProfile: string = '../../../assets/image/user.gif';
  viewFroala: boolean = true;
  nameEditor: string = '';
  commentTemp: string = '';

  public testListComments: Comment[] = [];
  public posts: Post[] = [];
  public images: Image[] = [];
  public attachments: Attached[] = [];


  constructor(public dialog: MatDialog,
    private sharedService: SharedService,
    private ps: PostService
    ) {
    this.file = new File(new Array<Blob>(), "Mock");
    this.initFroala();
    this.showFroala();
  }

  ngAfterViewInit() {
    this.ps.getPost().snapshotChanges().pipe(
      map(actions => actions.map(a => ({ key: a.payload.key, ...a.payload.val() })))
    ).subscribe(items => this.posts = items);
  }

  ngOnInit() {
    this.sharedService.suscriptor.subscribe((val) => {
      if (val != null)
        this.user = val.split('@')[0];
    })
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
  }

  createNewPost() {
    const post: Post = new Post();
    post.user = this.user;
    post.text = this.postTemp;
    post.imgProfile = this.imgProfile;
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

  commentPost(post) {
    this.dialog.open(CommentPost, {
      width: '350px', height: '320px',
      data: { post: post, user: this.user }
    });
  }

  deleteAtt(url, index) {
    this.ps.deleteFileTemp(url);
    this.attachments.splice(index, 1)
    if (this.attachments.length < 4)
      this.limitFiles = false;
  }
}
