import {Component} from '@angular/core';
import W3 from 'web3';
import {NavParams, NavController} from 'ionic-angular';
import {Wallet} from '../../models/wallet-model';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {Token} from '../../models/token-model';
import {WalletUtil} from '../../utils/wallet.util';
import { Storage } from '@ionic/storage';
import uuid from 'uuid/index.js'
import * as globals from '../../utils/global.util';
import { CryptoValidators } from '../../validators/crypto-validator';
import {SendTokenPage} from '../send-token/send-token';
import {ReceiveTokenPage} from '../receive-token/receive-token';
import {TransactionHistoryPage} from "../transaction-history/transaction-history";

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {
  private tokenForm: FormGroup;
  private _model: Token = new Token();

  private walletData: Wallet = new Wallet();
  private walletBalance: string;
  private walletBalanceStatus: string = 'pending';

  private tokenValid: boolean = false;

  constructor(public navParams: NavParams,
              private storage: Storage,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              public navCtrl: NavController
  ) {
    this.buildForm();

    let walletDataId = navParams.get('data')['id'];

    this.storage.get('wallets').then((wallets: Wallet[]) => {
      for (let wallet of wallets) {
        if (wallet.id === walletDataId) {
          this.walletData = wallet;

          this.getBalance();

          break;
        }
      }
    });

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

  private onSubmit(event: Event) {
    event.preventDefault();
  }

  private getBalance() {
    this.walletBalanceStatus = 'pending';

    web3.eth.getBalance(this.walletData.address)
      .then((balance) => {
        this.walletBalance = web3.utils.fromWei(balance, 'ether') + ' ETH';
        this.walletBalanceStatus = 'active';
      })
      .catch(function(e) {
        console.log(e);
      });

  }

  private validateToken() {
    try {
      let myContract = new web3.eth.Contract(
        [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}],
        this._model.address,
        {
          from: this.walletData.address, // default from address
        }
      );

      myContract.methods['symbol']().call({from: this.walletData.address})
        .then((symbol) => {
          this.tokenForm.controls['symbol'].setValue(symbol);
          this.tokenForm.updateValueAndValidity();

          return myContract.methods['decimals']().call({from: this.walletData.address});
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

  private createToken() {
    let myContract = new web3.eth.Contract(
      [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}],
      this._model.address,
      {
        from: this.walletData.address, // default from address
        gas: '4700000'
      }
    );

  }

  private addToken() {
    this._model.id = uuid();

    let token: Token = Object.assign({}, this._model);

    this.walletData.tokens.push(token);

    this.storage.get('wallets').then((wallets: Wallet[]) => {
      for (let wallet of wallets) {
        if (wallet.id === this.walletData.id) {
          wallet.tokens.push(token);
        }
      }
      this.storage.set('wallets', wallets);

      this.tokenForm.reset();
    });



    this._model.id = uuid();

    this.storage.get('tokens').then((tokens: Token[]) => {
      let tokenExist: boolean = false;
      for (let token of tokens) {
        if (token.address === this._model.address) {
          tokenExist = true;
          break;
        }
      }

      if (!tokenExist) {
        tokens.push(this._model);
        this.storage.set('tokens', tokens);
      }
    });
  }

  private gotoSendToken(tokenInfo: any) {
    this.navCtrl.push(SendTokenPage, {
      tokenInfo: tokenInfo
    });
  }

  private gotoReceiveToken(address: string) {
    this.navCtrl.push(ReceiveTokenPage, {
      address: address,
      walletName: this.walletData.name
    });
  }

  private gotoTransactionHistory(transactionInfo: any) {
    this.navCtrl.push(TransactionHistoryPage, {
      transactionInfo: transactionInfo
    });
  }

}
