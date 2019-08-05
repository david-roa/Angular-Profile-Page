import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/app/auth/auth.service'
import { Registry } from '../registry/registry.component'
import { take } from 'rxjs/operators';

export interface DialogData {
  type: string;
}

@Component({
  selector: 'app-suscription',
  templateUrl: './suscription.component.html',
  styleUrls: ['./suscription.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Suscription implements OnInit {
  public status: string = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor(
    public dialogRef: MatDialogRef<Suscription>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private as: AuthService,
    private af: AngularFireAuth
  ) { }

  ngOnInit() {}

  signIn() {
    this.as.loginEmailUser(this.emailFormControl.value, this.passFormControl.value)
      .then((res) => this.dialogRef.close())
      .catch((err) => {
        if (err.code == 'auth/user-not-found')
          this.emailFormControl.setErrors({ invalid: true })
        else if (err.code == 'auth/wrong-password')
          this.passFormControl.setErrors({ invalid: true })
      })
  }

  signUp() {    
    const dialogRef = this.dialog.open(Registry, {
      width: '300px', height: '500px',
      data: { type: this.data.type }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.af.authState.pipe(take(1)).subscribe(async (user) => {
        if (user) {
          this.dialogRef.close();
        }
      })
    });
  }
}
