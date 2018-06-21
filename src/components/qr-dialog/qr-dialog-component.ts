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

  private onNoClick(): void {
    this.dialogRef.close();
  }

  private useScan() {
    this.dialogRef.close('scan');
  }

  private useFile() {
    this.dialogRef.close('file');
  }
}
