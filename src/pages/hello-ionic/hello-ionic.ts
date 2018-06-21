import {Component, Output, EventEmitter, NgZone, ViewChild} from '@angular/core';
import W3 from 'web3';
import { Storage } from '@ionic/storage';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Wallet} from '../../models/wallet-model';
import {WalletUtil} from '../../utils/wallet.util';

import uuid from 'uuid/index.js'
import {Events} from 'ionic-angular';
import {CryptoValidators} from '../../validators/crypto-validator';
import {Token} from '../../models/token-model';
import {Contact} from '../../models/contact-model';
import {MatExpansionPanel} from '@angular/material';
import * as globals from '../../utils/global.util';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  private walletForm: FormGroup;
  private _model: Wallet = new Wallet();

  private contactForm: FormGroup;
  private _contactModel: Contact = new Contact();

  private contactList: Contact[];

  @ViewChild('contactAccordion')
  private contactAccordion: MatExpansionPanel;

  @ViewChild('addContactAccordion')
  private addContactAccordion: MatExpansionPanel;

  @Output()
  public onCreate = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private event: Events,
    private walletUtil: WalletUtil,
    private zone: NgZone
  ) {
    this.buildForm();
    this.retrieveData();
  }

  private createWallet() {
    this.storage.get('wallets').then((wallets: Wallet[]) => {
      this._model.id = uuid();

      this.walletForm.controls['privateKey'].setValue(this._model.privateKey.startsWith("0x") ? this._model.privateKey : '0x' + this._model.privateKey);

      this.walletForm.controls['address'].setValue(web3.eth.accounts.privateKeyToAccount(this._model.privateKey).address);
      this.walletForm.controls['address'].updateValueAndValidity();

      let walletModel: Wallet = Object.assign({}, this._model);

      wallets.push(walletModel);
      this.storage.set('wallets', wallets);
      this.event.publish('wallet.created', walletModel);

      this.walletForm.reset();
    })
  }

  private createContact() {
    this.storage.get('contacts').then((contacts: Contact[]) => {
      this.zone.run(() => {
        this._contactModel.id = uuid();

        let contactModel: Contact = Object.assign({}, this._contactModel);

        contacts.push(contactModel);
        this.storage.set('contacts', contacts);

        this.contactList.push(contactModel);

        this.addContactAccordion.close();
        this.contactAccordion.open();

        this.contactForm.reset();
      });
    });

  }

  private removeContact(contactId: string) {
    this.storage.get('contacts').then((contacts: Contact[]) => {
      this.zone.run(() => {

        for (let contact of contacts) {
          if (contact.id === contactId) {
            let index = contacts.indexOf(contact);
            contacts.splice(index, 1);
            break;
          }
        }

        this.storage.set('contacts', contacts);

        this.contactList = contacts;
      });
    });
  }

  private resetWallet() {

    this.storage.get('wallets').then((wallets: Wallet[]) => {
      wallets = [];
      this.storage.set('wallets', wallets);
    });

    this.storage.get('tokens').then((tokens: Token[]) => {
      tokens = [];
      this.storage.set('tokens', tokens);
    });

    this.storage.get('contacts').then((contacts: Contact[]) => {
      contacts = [];
      this.storage.set('contacts', contacts);
    });

    this.contactList = [];

    this.event.publish('wallet.reset');
  }

  private retrieveData() {
    this.storage.get('contacts').then((contacts: Contact[]) => {
      this.contactList = contacts;
    });
  }

  private buildForm() {
    this.walletForm = this.createWalletFormGroup();

    this.walletForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });

    this.contactForm = this.createContactFormGroup();

    this.contactForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._contactModel, data);
    })
  }

  private createWalletFormGroup(model: Wallet = new Wallet()): FormGroup {
    return this.fb.group({
      'name': new FormControl(model.name, Validators.required),
      'address': new FormControl(model.address, []),
      'privateKey': new FormControl(model.privateKey, [Validators.required, CryptoValidators.privateKeyIsValid])
    });
  }

  private createContactFormGroup(contactModel: Contact = new Contact()): FormGroup {
    return this.fb.group({
      'name': new FormControl(contactModel.name, Validators.required),
      'address': new FormControl(contactModel.address, [Validators.required, CryptoValidators.addressIsValid])
    })
  }

  private onSubmit(event: Event) {
    event.preventDefault();
  }

}
