import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { SocialComponent } from './profile/social/social.component';
import { MessageComponent, SnackBarComponent } from './profile/message/message.component';
import { BodyComponent } from './body/body.component';
import { UploadImage } from './body/upload/Image/upload-image.component';
import { UploadFilePost } from './body/upload/file/upload-file.component';
import { environment } from '../../environments/environment';

import { FirebaseService } from '../services/firebase/firebase.service';
import { SharedService } from '../services/shared/shared-service.service';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { SlideshowModule } from 'ng-simple-slideshow';
import { NgxUploaderModule } from 'ngx-uploader';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  declarations: [
    ProfileComponent,
    SocialComponent,
    MessageComponent,
    SnackBarComponent,
    BodyComponent,
    UploadImage,
    UploadFilePost
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxUploaderModule,
    SlideshowModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatTreeModule,
    MatExpansionModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    /**
     * Firebase
     */
    AngularFireMessagingModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  exports: [
    ProfileComponent,
    SocialComponent,
    MessageComponent,
    SnackBarComponent,
    BodyComponent,
    UploadImage,
    UploadFilePost
  ],
  providers: [FirebaseService,SharedService],
  bootstrap: [ProfileComponent, SocialComponent, MessageComponent, SnackBarComponent, BodyComponent, UploadImage, UploadFilePost]
})
export class HomeModule { }
