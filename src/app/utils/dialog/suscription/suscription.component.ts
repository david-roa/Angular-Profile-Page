import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  suscriptor: string;
}
@Component({
  selector: 'app-suscription',
  templateUrl: './suscription.component.html',
  styleUrls: ['./suscription.component.css']
})
export class Suscription implements OnInit{
  emailGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<Suscription>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.emailGroup = this._formBuilder.group({
      suscriptor: ['', Validators.required]
    });
  }
}
