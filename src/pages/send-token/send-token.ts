import {Component, NgZone} from '@angular/core';
import W3 from 'web3';
import {Signature} from 'web3/types';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {TokenTransaction} from '../../models/token-transaction-model';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, Platform} from 'ionic-angular';
import {ContactListComponent} from '../../components/contact-list/contact-list-component';
import {MatDialog, MatSnackBar} from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'send-token',
  templateUrl: 'send-token.html'
})
export class SendTokenPage {

  private tokenInfo: any;
  private address: string;
  private privateKey: string;
  private contract: string;
  private symbol: string;
  private decimals: number;
  private receipt: string;

  private isLoading: boolean = false;
  private isSuccessful: boolean = false;

  private tokenTransactionForm: FormGroup;
  private _model: TokenTransaction = new TokenTransaction();

  private copyHash() {
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
      'to': new FormControl(model.to, [Validators.required, CryptoValidators.addressIsValid]),
      'amount': new FormControl(model.amount, Validators.required),
      'gas': new FormControl(model.gas, Validators.required),
    });
  }

  private sendToken() {
    this.isLoading = true;
    this.tokenTransactionForm.disable();

    let transferValue = Math.pow(10, this.decimals)*this._model.amount;

    let data = this.walletUtil.encodeFunctionTxData('transfer', ['address', 'uint256'], [this._model.to, this.walletUtil.toFixed(transferValue).toString()]);

    web3.eth.getTransactionCount(this.address)
      .then((nonce) => {
        console.log(nonce);
        let prom: Promise<string>|Signature = web3.eth.accounts.signTransaction(
          {
            nonce: nonce,
            to: this.contract,
            value: 0,
            data: data,
            gas: this._model.gas
          },
          this.privateKey
        );

        if(prom instanceof Promise) {
          return prom;
        }
      })
      .then((signature: any) => {
        console.log(signature.rawTransaction);

        web3.eth.sendSignedTransaction(signature.rawTransaction)
          .on('transactionHash', (hash) => {
            console.log('transactionHash', hash);
          })
          .on('receipt', (receipt) => {
            console.log('receipt', receipt);
            this.zone.run(() => {
              this.receipt = receipt.transactionHash;
              this.isSuccessful = true;
              this.isLoading = false;
              this.tokenTransactionForm.enable();
            });
          })
          .on('confirmation', (confirmationNumber, receipt) =>{
            console.log('confirmation');
            console.log(confirmationNumber);
            console.log(receipt);
          })
          .on('error', console.error);

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  private getEstimatedGas() {
    let transferValue = Math.pow(10, this.decimals)*this._model.amount;

    let data = this.walletUtil.encodeFunctionTxData('transfer', ['address', 'uint256'], [this._model.to, this.walletUtil.toFixed(transferValue).toString()]);

    web3.eth.estimateGas({
      from: this.address,
      to: this.contract,
      data: data
    })
      .then((gas) => {
        this.tokenTransactionForm.controls['gas'].setValue(gas);
        this.tokenTransactionForm.controls['gas'].updateValueAndValidity();
      });
  }

  private showContactList() {
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
    this.tokenInfo = navParams.get('tokenInfo');

    this.address = this.tokenInfo['address'];
    this.privateKey = this.tokenInfo['privateKey'];
    this.contract = this.tokenInfo['contract'];
    this.symbol = this.tokenInfo['symbol'];
    this.decimals = this.tokenInfo['decimals'];

    this.buildForm();

  }

}
