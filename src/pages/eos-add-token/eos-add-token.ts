import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, NavController} from 'ionic-angular';
import {StorageUtil} from "../../utils/storage.util";
import {EosToken} from "../../models/token-model";
import Eos from 'eosjs/lib/index.js';
import {MatSnackBar} from "@angular/material";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-add-token',
  templateUrl: 'eos-add-token.html'
})
export class EosAddTokenPage {

  private walletId: string;
  private tokenForm: FormGroup;
  private _model: EosToken = new EosToken();

  protected tokenValid: boolean = false;

  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              private storageUtil: StorageUtil,
              private snackBar: MatSnackBar,
              public navCtrl: NavController) {
    this.walletId = this.navParams.get('walletId');

    this.buildForm();

  }

  private buildForm() {
    this.tokenForm = this.creatTokenFormGroup();

    this.tokenForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
      this.tokenValid = false;
    });
  }

  private creatTokenFormGroup(model: EosToken = new EosToken()): FormGroup {
    return this.fb.group({
      'code': new FormControl(model.code, [Validators.required, CryptoValidators.eosAccountlIsValid]),
      'symbol': new FormControl(model.symbol, [Validators.required, CryptoValidators.eosSymbolIsValid])
    });
  }

  protected validateToken() {
    eos.getCurrencyStats(this._model.code, this._model.symbol)
      .then((stats) => {
        this.tokenValid = true;
      })
      .catch((err) => {
        this.tokenValid = false;
        this.snackBar.open('invalid token', 'Dismiss', {
          duration: 2000,
        });
      });

  }

  protected addToken() {
    this.storageUtil.addEosTokenToWallet(this._model, this.walletId).then((token: EosToken) => {
      this.navCtrl.pop();
    });
  }

}
