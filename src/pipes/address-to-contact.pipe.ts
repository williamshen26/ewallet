import { Pipe, PipeTransform } from '@angular/core';
import {Wallet} from '../models/wallet-model';
import {Contact} from '../models/contact-model';

@Pipe({ name: 'contact' })
export class AddressToContactPipe implements PipeTransform {

  constructor () {

  }

  transform(value: string, contacts: Contact[], wallets: Wallet[]) {
    let newVal: string = value;
    let found: boolean = false;

    if (!value) {return ''; }

    for (let contact of contacts) {
      if(contact.address.toLowerCase() === value.toLowerCase()) {
        newVal = contact.name;
        found = true;
        break;
      }
    }

    if (!found) {
        for (let wallet of wallets) {
          if (wallet.address.toLowerCase() === value.toLowerCase()) {
            newVal = wallet.name;
            break;
          }
        }
    }

    return newVal;
  }
}
