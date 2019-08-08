import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Suscription, SnackBarComponent } from './suscription.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedService } from '../../../services/shared/shared-service.service';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Registry } from '../registry/registry.component'

@NgModule({
  declarations: [
    Suscription,
    SnackBarComponent,
    Registry
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    /**
     * firebase
     */
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  exports: [
    Suscription,
    SnackBarComponent,
    Registry
  ],
  providers: [
    SharedService
  ],
  bootstrap: [
    Suscription,
    SnackBarComponent,
    Registry
  ]
})
export class SuscriptionModule { }
