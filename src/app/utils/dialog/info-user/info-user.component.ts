import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  suscriptor: string;
  alert:boolean
}
@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUser implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<InfoUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onSuscriber(){
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
