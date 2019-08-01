import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class MessageComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  color = 'primary';
  mode = 'buffer';
  value = 0;
  bufferValue = 0;

  durationInSeconds = 5;

  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      message: ['', Validators.required]
    });
  }

  openSnackBar(name) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: name,
      duration: this.durationInSeconds * 1000,
    });
  }

  sendMessage() {
    this.load();
    this.openSnackBar(this.firstFormGroup.get('name').value);
    this.onNoClick();
  }

  onNoClick(): void {
    this.noload();
    this.dialogRef.close();
  }

  noload(): void {
    console.log('No Existe');
    this.mode = "buffer";
    this.value = 0;
    this.bufferValue = 0;
  }

  load(): void {
    this.mode = "indeterminate";
    this.value = 50;
    this.bufferValue = 75;
  }

}

@Component({
  selector: 'snack-bar',
  templateUrl: 'snack-bar.component.html',
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
