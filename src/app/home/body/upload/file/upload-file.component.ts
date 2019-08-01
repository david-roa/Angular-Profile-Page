import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

export interface DialogData {
    file: File
}

@Component({
    selector: 'body-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css'],
})
export class UploadFilePost implements OnInit {
    fileName: string;
    loadingFile = false;
    file: File;
    extFile:string;

    // Upload file

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;

    constructor(
        public dialogRef: MatDialogRef<UploadFilePost>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.options = {
            concurrency: 1,
            maxUploads: 1
        };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }
    ngOnInit() { }
    onUploadOutput(output: UploadOutput): void {
        if (output.type === 'addedToQueue') {
            this.loadingFile = true;
            const file = output.file;
            if (file) {
                this.files.push(output.file);
                this.fileName = file.name;
                this.file = file.nativeFile;  
                this.extFile = file.name.split('.')[1];
                this.data.file = this.file;             
                this.loadingFile = false;
            }
        } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
            console.log('Las extensiones de archivo permitidas son: .pdf, .xlsx, .pptx, .docx y .csv')
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        }
    }

    removeCertificate(): void {
        this.files = [];
        this.uploadInput.emit({ type: 'removeAll' });
        this.file = null;
    }
}