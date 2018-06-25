import {Component} from '@angular/core';
import W3 from 'web3';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, NavController} from 'ionic-angular';
import {StorageUtil} from "../../utils/storage.util";
import {Token} from "../../models/token-model";

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'add-token',
  templateUrl: 'add-token.html'
})
export class AddTokenPage {

  private walletId: string;
  private walletAddress: string;
  private callback: Function;
  private tokenForm: FormGroup;
  private _model: Token = new Token();

  protected tokenValid: boolean = false;

  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              private storageUtil: StorageUtil,
              public navCtrl: NavController) {
    this.walletId = this.navParams.get('walletId');
    this.walletAddress = this.navParams.get('walletAddress');
    this.callback = this.navParams.get('callback');

    this.buildForm();

  }

  private buildForm() {
    this.tokenForm = this.creatTokenFormGroup();

    this.tokenForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
      this.tokenValid = false;
    });
  }

  private creatTokenFormGroup(model: Token = new Token()): FormGroup {
    return this.fb.group({
      'address': new FormControl(model.address, [Validators.required, CryptoValidators.addressIsValid]),
      'symbol': new FormControl(model.symbol, []),
      'decimal': new FormControl(model.decimal, [])
    });
  }

  protected validateToken() {
    try {
      let myContract = new web3.eth.Contract(
        [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}],
        this._model.address,
        {
          from: this.walletAddress, // default from address
        }
      );

      myContract.methods['symbol']().call({from: this.walletAddress})
        .then((symbol) => {
          this.tokenForm.controls['symbol'].setValue(symbol);
          this.tokenForm.updateValueAndValidity();

          return myContract.methods['decimals']().call({from: this.walletAddress});
        })
        .then((decimals) => {
          this.tokenForm.controls['decimal'].setValue(decimals);
          this.tokenForm.updateValueAndValidity();

          this.tokenValid = true;
        })
        .catch(function(e) {
          console.log(e);
          this.tokenValid = false;
        });
    } catch (err) {
      this._model.symbol = 'error';
      this._model.decimal = 0;
    }

  }

  protected addToken() {
    this.storageUtil.addTokenToWallet(this._model, this.walletId).then((token: Token) => {
      this.callback(true, token).then(()=>{
        this.navCtrl.pop();
      });
    });
  }

}
