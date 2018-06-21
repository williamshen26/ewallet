import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'qr-dialog',
  templateUrl: 'qr-dialog-component.html'
})
export class QrDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected useScan() {
    this.dialogRef.close('scan');
  }

  protected useFile() {
    this.dialogRef.close('file');
  }
}
