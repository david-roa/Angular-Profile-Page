import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoUser } from './info-user.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InfoUser],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule, 
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  exports: [
    InfoUser
  ],
  bootstrap: [InfoUser]
})
export class InfoUserModule { }
