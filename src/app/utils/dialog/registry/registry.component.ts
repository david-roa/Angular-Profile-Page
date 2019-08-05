import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/app/auth/auth.service';
import { TokenService } from '../../../services/app/auth/token.service'

export interface DialogData {
  type: string;
}

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Registry implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor(
    public dialogRef: MatDialogRef<Registry>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private as: AuthService,
    private ts: TokenService
  ) { }

  ngOnInit() {}

  registry() {
    this.as.registerUser(this.emailFormControl.value, this.passFormControl.value)
      .then(res => {
        this.ts.createUser(this.data.type);
        this.dialogRef.close();
      })
      .catch(err => {
        if (err.code == 'auth/email-already-in-use')
          this.emailFormControl.setErrors({ invalid: true })
      })
  }
}
