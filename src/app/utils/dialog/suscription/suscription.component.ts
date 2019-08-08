import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { AuthService } from '../../../services/app/auth/auth.service';
import { TokenService } from '../../../services/app/auth/token.service';
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
    private af: AngularFireAuth,
    private ts: TokenService,
    private snk: MatSnackBar
  ) { }

  ngOnInit() { }

  signIn() {
    this.as.loginEmailUser(this.emailFormControl.value, this.passFormControl.value)
      .then((res: any) => {
        if (res.emailVerified) {
          this.dialogRef.close()
        }
        else
          this.openSnackBar(res.displayName)
      })
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
          if (user.emailVerified)
            this.dialogRef.close();
          else{
            this.as.logoutUser();
            this.openSnackBar(user.displayName);
          }
        }
      })
    });
  }

  signGoogle() {
    this.as.googleSignin()
      .then((res: any) => {
        this.ts.createUser(this.data.type);
        this.dialogRef.close()
      })
  }

  signFacebook() {
    this.as.facebookSignin()
      .then((res: any) => {
        this.ts.createUser(this.data.type);
        this.dialogRef.close()
      })
  }

  openSnackBar(user) {
    this.snk.openFromComponent(SnackBarComponent, {
      data: user,
      duration: 5 * 1000,
    });
  }
}

@Component({
  selector: 'snack-bar',
  template: `<span class="dr-data">
  {{data}}
</span>
<span class="dr-message">
  Verifica tu Email! 📧👉📬
</span>`,
  styles: [`
    .dr-data {
      color: #2196f3;
    }
    .dr-message {
      padding-left: 10px;
      color: #797979;
    }
  `],
})
export class SnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
