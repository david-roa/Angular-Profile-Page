import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/app/auth/auth.service';
import { TokenService } from '../../../services/app/auth/token.service';

export interface DialogData {
  type: string;
}

export interface Icon {
  name: string;
  url: string;
}

export interface IconGroup{
  name: string;
  icon: Icon[];
}

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Registry implements OnInit {

  userNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  photoFormControl = new FormControl('', [
    Validators.required,
  ]);

  icons: IconGroup[] = [
    {
      name: 'Mujer', 
      icon: [
        {name: '001',url: '../../../../assets/icons/profile/001-female.png'},{name: '003',url: '../../../../assets/icons/profile/003-female.png'},{name: '006',url: '../../../../assets/icons/profile/006-female.png'},{name: '007',url: '../../../../assets/icons/profile/007-female.png'},{name: '010',url: '../../../../assets/icons/profile/010-female.png'},
        {name: '011',url: '../../../../assets/icons/profile/011-female.png'},{name: '012',url: '../../../../assets/icons/profile/012-female.png'},{name: '015',url: '../../../../assets/icons/profile/015-female.png'},{name: '016',url: '../../../../assets/icons/profile/016-female.png'},{name: '018',url: '../../../../assets/icons/profile/018-female.png'},
        {name: '020',url: '../../../../assets/icons/profile/020-female.png'},{name: '021',url: '../../../../assets/icons/profile/021-female.png'},{name: '023',url: '../../../../assets/icons/profile/023-female.png'},{name: '024',url: '../../../../assets/icons/profile/024-female.png'},{name: '025',url: '../../../../assets/icons/profile/025-female.png'},
        {name: '026',url: '../../../../assets/icons/profile/026-female.png'},{name: '027',url: '../../../../assets/icons/profile/027-female.png'}
      ]
    },
    {
      name: 'Hombre',
      icon: [
        {name: '002',url: '../../../../assets/icons/profile/002-male.png'},{name: '004',url: '../../../../assets/icons/profile/004-male.png'},{name: '005',url: '../../../../assets/icons/profile/005-male.png'},{name: '008',url: '../../../../assets/icons/profile/008-male.png'},{name: '009',url: '../../../../assets/icons/profile/009-male.png'},
        {name: '013',url: '../../../../assets/icons/profile/013-male.png'},{name: '014',url: '../../../../assets/icons/profile/014-male.png'},{name: '017',url: '../../../../assets/icons/profile/017-male.png'},{name: '019',url: '../../../../assets/icons/profile/019-male.png'},{name: '022',url: '../../../../assets/icons/profile/022-male.png'},
        {name: '028',url: '../../../../assets/icons/profile/028-male.png'},{name: '029',url: '../../../../assets/icons/profile/029-male.png'},{name: '030',url: '../../../../assets/icons/profile/030-male.png'}
      ]
    }
  ];

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
        this.as.updateUser(this.photoFormControl.value,this.userNameFormControl.value)
        .then((rest) => {
          this.ts.createUser(this.data.type);
          this.dialogRef.close();
        })
      })
      .catch(err => {
        if (err.code == 'auth/email-already-in-use')
          this.emailFormControl.setErrors({ invalid: true })
      })
  }
}
