import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/languages/de.js';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { WorkModule } from './work/work.module';

import { AppComponent } from './app.component';
import { SuscriptionModule } from './utils/dialog/suscription/suscription.module';
import { InfoUserModule } from './utils/dialog/info-user/info-user.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FirebaseService } from './services/firebase/firebase.service';
import { SharedService } from './services/shared/shared-service.service';
import { AuthService } from './services/app/auth/auth.service';
import { TokenService } from './services/app/auth/token.service';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    HomeModule,
    WorkModule,
    SuscriptionModule,
    InfoUserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    /**
     * firebase
     */
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    FirebaseService,
    SharedService,
    AuthService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
