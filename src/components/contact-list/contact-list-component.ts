import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Wallet} from '../../models/wallet-model';
import {Contact} from '../../models/contact-model';
import {StorageUtil} from "../../utils/storage.util";

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list-component.html'
})
export class ContactListComponent {
  protected wallets: Wallet[];
  protected contacts: Contact[];

  constructor(
    public dialogRef: MatDialogRef<ContactListComponent>,
    private storageUtil: StorageUtil,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.storageUtil.getWallets().then((wallets: Wallet[]) => {
      this.wallets = wallets;
    });

    this.storageUtil.getContacts().then((contacts: Contact[]) => {
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
