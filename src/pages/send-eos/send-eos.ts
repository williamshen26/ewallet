import {Component, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {TokenTransaction} from '../../models/token-transaction-model';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {NavParams, Platform} from 'ionic-angular';
import {ContactListComponent} from '../../components/contact-list/contact-list-component';
import {MatDialog, MatSnackBar} from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard';

import Eos from 'eosjs/lib/index.js';
import {CryptoValidators} from "../../validators/crypto-validator";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'send-eos',
  templateUrl: 'send-eos.html'
})
export class SendEosPage {
  private eosInfo: any;
  private account: string;
  private privateKey: string;
  private code: string;
  private symbol: string;
  private decimals: number;

  private receipt: string;

  protected isLoading: boolean = false;
  protected isSuccessful: boolean = false;
  protected isFailed: boolean = false;

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
      'to': new FormControl(model.to, [Validators.required, CryptoValidators.eosAccountlIsValid]),
      'amount': new FormControl(model.amount, Validators.required)
    });
  }

  protected sendEos() {
    this.isLoading = true;
    this.tokenTransactionForm.disable();

    eos.contract(this.code)
      .then(myaccount => myaccount['transfer']({
          from: this.account,
          to: this._model.to,
          quantity: parseFloat(this.walletUtil.toFixed(this._model.amount)).toFixed(this.decimals) + ' ' + this.symbol,
          memo: ''
        }, {authorization: this.account})
        .then((result) => {
          this.zone.run(() => {
            this.isLoading = false;
            this.tokenTransactionForm.enable();
            this.receipt = result['transaction_id'];
            this.isSuccessful = true;
          });
        })
        .catch((err) => {
          this.isLoading = false;
          this.tokenTransactionForm.enable();
          this.receipt = (JSON.parse(err)['error']['details'].length > 0) ? JSON.parse(err)['error']['details'][0]['message'] : JSON.parse(err)['error']['what'];
          this.isFailed = true;
        })
      );

  }

  protected showContactList() {
    let dialogRef = this.dialog['open'](ContactListComponent, {
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
    this.code = this.eosInfo['code'] ? this.eosInfo['code'] : 'eosio.token';
    this.symbol = this.eosInfo['symbol'] ? this.eosInfo['symbol'] : 'EOS';

    eos.getCurrencyStats(this.code, this.symbol)
      .then((stats) => {
        let asset = Eos['modules']['format']['parseAsset']( stats[this.symbol]['max_supply'] );
        this.decimals = asset.precision;
      });

    this.buildForm();

    config.keyProvider.push(this.privateKey);
    // eos = Eos(config);

  }

}
