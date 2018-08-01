import {Component, Output, EventEmitter, NgZone, ViewChild} from '@angular/core';
import W3 from 'web3';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Wallet, EosWallet} from '../../models/wallet-model';
import {WalletUtil} from '../../utils/wallet.util';

import {Events} from 'ionic-angular';
import {CryptoValidators} from '../../validators/crypto-validator';
import {Contact} from '../../models/contact-model';
import {MatExpansionPanel, MatDialog, MatSnackBar} from '@angular/material';
import * as globals from '../../utils/global.util';
import {StorageUtil} from '../../utils/storage.util';
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {Platform} from 'ionic-angular';
import {Clipboard} from "@ionic-native/clipboard";

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));
import Eos from 'eosjs/lib/index.js';
import ecc from 'eosjs-ecc/lib/index.js';
import {HttpClient} from "@angular/common/http";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  private walletForm: FormGroup;
  private _model: Wallet = new Wallet();

  private contactForm: FormGroup;
  private _contactModel: Contact = new Contact();

  private eosWalletForm: FormGroup;
  private _eosWalletModel: EosWallet = new EosWallet();

  private contactList: Contact[];

  protected walletCreateSuccessful: boolean = false;
  protected createdAddress: string;
  protected createdPrivateKey: string;

  @ViewChild('contactAccordion')
  private contactAccordion: MatExpansionPanel;

  @Output()
  public onCreate = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private event: Events,
    private walletUtil: WalletUtil,
    private storageUtil: StorageUtil,
    private dialog: MatDialog,
    private zone: NgZone,
    private platform: Platform,
    private clipboard: Clipboard,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {


    this.buildForm();
    this.retrieveData();
  }

  protected createEosWallet() {
    this.eosWalletForm.controls['address'].setValue(ecc.PrivateKey(this._eosWalletModel.privateKey).toPublic().toString());
    this.eosWalletForm.controls['address'].updateValueAndValidity();

    eos.getKeyAccounts(this._eosWalletModel.address).then((account) => {
      this.zone.run(() => {
        this.eosWalletForm.controls['account'].setValue(account['account_names'][0]);
        this.eosWalletForm.controls['account'].updateValueAndValidity();
      });

      let eosWalletModel: EosWallet = Object.assign({}, this._eosWalletModel);

      this.storageUtil.addEosWallet(eosWalletModel).then(() => {
        this.event.publish('eos.wallet.created', eosWalletModel);

        this.zone.run(() => {
          this.walletCreateSuccessful = true;
          this.createdAddress = this._eosWalletModel.account;
          this.createdPrivateKey = this._eosWalletModel.privateKey;

          this.eosWalletForm.reset();
        });
      })
    });

  }

  protected createEthWallet() {
    this.walletForm.controls['privateKey'].setValue(this._model.privateKey.startsWith("0x") ? this._model.privateKey : '0x' + this._model.privateKey);

    this.walletForm.controls['address'].setValue(web3.eth.accounts.privateKeyToAccount(this._model.privateKey).address);
    this.walletForm.controls['address'].updateValueAndValidity();

    let walletModel: Wallet = Object.assign({}, this._model);

    this.storageUtil.addWallet(walletModel).then(() => {
      this.event.publish('eth.wallet.created', walletModel);

      this.zone.run(() => {
        this.walletCreateSuccessful = true;
        this.createdAddress = this._model.address;
        this.createdPrivateKey = this._model.privateKey;

        this.walletForm.reset();
      });

    });
  }

  protected generateEthAccount() {
    this.walletForm.controls['privateKey'].setValue(web3.eth.accounts.create().privateKey);
    this.walletForm.controls['privateKey'].updateValueAndValidity();
  }

  protected createContact() {
    let contactModel: Contact = Object.assign({}, this._contactModel);

    this.storageUtil.addContact(contactModel).then(() => {
      this.zone.run(() => {
        this.contactList.push(contactModel);

        this.contactAccordion.open();

        this.contactForm.reset();
      });
    });

  }

  protected readyRemoveContact(contactId: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to remove this contact?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.removeContact(contactId);
        }
      }
      deregister();

    });
  }

  private removeContact(contactId: string) {

    this.storageUtil.removeContact(contactId).then((contacts) => {
      this.zone.run(() => {
        this.contactList = contacts;
      });
    });
  }

  protected readyResetWallet() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to reset the wallet?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.resetWallet();
        }
      }
      deregister();

    });
  }

  protected resetWallet() {

    this.storageUtil.resetEveryThing();

    this.contactList = [];

    this.event.publish('wallet.reset');
  }

  private retrieveData() {
    this.storageUtil.getContacts().then((contacts: Contact[]) => {
      this.contactList = contacts;
    });
  }

  private buildForm() {
    this.walletForm = this.createWalletFormGroup();

    this.walletForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });

    this.eosWalletForm = this.createEosWalletFormGroup();

    this.eosWalletForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._eosWalletModel, data);
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

  private createEosWalletFormGroup(eosModel: EosWallet = new EosWallet()): FormGroup {
    return this.fb.group({
      'name': new FormControl(eosModel.name, Validators.required),
      'account': new FormControl(eosModel.account, []),
      'address': new FormControl(eosModel.address, []),
      'privateKey': new FormControl(eosModel.privateKey, [Validators.required])
    });
  }

  private createContactFormGroup(contactModel: Contact = new Contact()): FormGroup {
    return this.fb.group({
      'name': new FormControl(contactModel.name, Validators.required),
      'address': new FormControl(contactModel.address, [Validators.required, CryptoValidators.addressIsValid])
    })
  }

  protected onSubmit(event: Event) {
    event.preventDefault();
  }

  protected copyWallet() {
    this.clipboard.copy('{address: \'' + this.createdAddress + '\', privateKey: \'' + this.createdPrivateKey + '\'}')
      .then(() => {
        this.snackBar.open('copied to clipboard', 'Dismiss', {
          duration: 2000,
        });
      });
  }


}
