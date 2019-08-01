import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadImage } from './upload/Image/upload-image.component';
import { UploadFilePost } from './upload/file/upload-file.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { SharedService } from '../../services/shared/shared-service.service';
import FroalaEditor from 'froala-editor';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {
  public options: Object = {
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
  }

  panelOpenState = false;
  date = new Date();
  datePost = new Date("2019-03-04");
  file: File;
  images = [];
  nameImges = [];
  namesFiles = [];
  urlFiles = [];
  extFiles = [];
  postTemp: string;
  limitFiles: boolean = false;
  limitImg: boolean = false;
  user: string;
  idNewPost: number;
  imgProfile: string = '../../../assets/image/user.gif';

  constructor(public dialog: MatDialog,
    private sharedService: SharedService,
    private messagingService: FirebaseService) {
    this.file = new File(new Array<Blob>(), "Mock");
    this.idNewPost = new Date().getTime();
    this.initFroala();
  }
  ngOnInit() {
    this.sharedService.suscriptor.subscribe((val) => {
      this.user = val.split('@')[0];
    })
    this.date = new Date();
  }

  uploadImg() {
    const dialogRef = this.dialog.open(UploadImage, {
      width: '350px', height: '320px',
      data: { file: this.file }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        this.file = result;
        this.nameImges.push(this.file.name);
        var url = await this.messagingService.uploadFilePost(this.file, this.idNewPost, this.images.length);
        this.images.push(url);
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
        var url = await this.messagingService.uploadFilePost(this.file, this.idNewPost, this.namesFiles.length);
        this.namesFiles.push(this.file.name);
        this.extFiles.push(this.file.name.split('.')[1])
        this.urlFiles.push(url);
      }
      if (this.extFiles.length < 5) {
      } else {
        this.limitFiles = true;
      }
    });
  }
  deletePostTemp() {
    this.messagingService.deleteFilesPostTemp(this.idNewPost, this.namesFiles, this.nameImges)
    this.limitImg = null;
    this.limitFiles = null;
    this.images = [];
    this.nameImges = [];
    this.namesFiles = [];
    this.extFiles = [];
    this.urlFiles = [];
    this.postTemp = null;
  }

  createNewPost() {
    var newPost = {
      imgProfile: this.imgProfile,
      user: this.user.split('@')[0],
      date: this.date,
      text: this.postTemp,
      images: this.images,
      namesFiles: this.namesFiles,
      urlsFiles: this.urlFiles,
      coments: []
    }
    this.messagingService.saveNewPost(newPost, this.idNewPost).then(() => {
      this.limitImg = null;
      this.limitFiles = null;
      this.images = [];
      this.nameImges = [];
      this.namesFiles = [];
      this.extFiles = [];
      this.urlFiles = [];
      this.postTemp = null;
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
}
