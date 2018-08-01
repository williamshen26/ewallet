import {Component, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {TokenTransaction} from '../../models/token-transaction-model';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, Platform} from 'ionic-angular';
import {ContactListComponent} from '../../components/contact-list/contact-list-component';
import {MatDialog, MatSnackBar} from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard';

import ecc from 'eosjs-ecc/lib/index.js';
import Eos from 'eosjs/lib/index.js';


@Component({
  selector: 'send-eos',
  templateUrl: 'send-eos.html'
})
export class SendEosPage {
  private eos: Eos;

  private eosInfo: any;
  private account: string;
  private privateKey: string;
  private receipt: string;

  protected isLoading: boolean = false;
  protected isSuccessful: boolean = false;

  private tokenTransactionForm: FormGroup;
  private _model: TokenTransaction = new TokenTransaction();

  protected copyHash() {
    this.clipboard.copy(this.receipt)
      .then(() => {
        this.snackBar.open('copied to clipboard', 'Dismiss', {
          duration: 2000,
        });
      });
  }

  private buildForm() {
    this.tokenTransactionForm = this.creatTokenTransactionFormGroup();

    this.tokenTransactionForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });
  }

  private creatTokenTransactionFormGroup(model: TokenTransaction = new TokenTransaction()): FormGroup {
    return this.fb.group({
      'to': new FormControl(model.to, [Validators.required]),
      'amount': new FormControl(model.amount, Validators.required)
    });
  }

  protected sendEos() {
    this.isLoading = true;
    this.tokenTransactionForm.disable();

    //TODO
    this.eos.transaction(
      {
        // ...headers,
        actions: [
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
              actor: this.account,
              permission: 'owner'
            }],
            data: {
              from: this.account,
              to: this._model.to,
              quantity: this._model.amount + ' EOS',
              memo: ''
            }
          }
        ]
      }
    ).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }

  protected showContactList() {
    let dialogRef = this.dialog.open(ContactListComponent, {
      width: '900px',
      data: { }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.tokenTransactionForm.controls['to'].setValue(result);
        this.tokenTransactionForm.updateValueAndValidity();
      }
      deregister();
    });
  }


  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private platform: Platform,
              private clipboard: Clipboard,
              private zone: NgZone) {
    this.eosInfo = this.navParams.get('eosInfo');

    this.account = this.eosInfo['account'];
    this.privateKey = this.eosInfo['privateKey'];

    this.buildForm();

    let config = {
      chainId: null, // 32 byte (64 char) hex string
      keyProvider: [this.privateKey], // WIF string or array of keys..
      httpEndpoint: globals.eosNetwork,
      expireInSeconds: 60,
      broadcast: true,
      verbose: false, // API activity
      sign: true
    };

    this.eos = Eos(config);

  }

}
