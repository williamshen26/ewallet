import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Storage } from '@ionic/storage';
import {Wallet} from '../../models/wallet-model';
import {Contact} from '../../models/contact-model';

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list-component.html'
})
export class ContactListComponent {
  protected wallets: Wallet[];
  protected contacts: Contact[];

  constructor(
    public dialogRef: MatDialogRef<ContactListComponent>,
    private storage: Storage,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.storage.get('wallets').then((wallets: Wallet[]) => {
      this.wallets = wallets;
    });

    this.storage.get('contacts').then((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected retrieveAddress(address: string) {
    this.dialogRef.close(address);
  }
}
