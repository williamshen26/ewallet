import {Component} from '@angular/core';
import W3 from 'web3';
import {NavParams, NavController, Events} from 'ionic-angular';
import {Wallet} from '../../models/wallet-model';
import {Token} from '../../models/token-model';
import * as globals from '../../utils/global.util';
import {SendTokenPage} from '../send-token/send-token';
import {ReceiveTokenPage} from '../receive-token/receive-token';
import {TransactionHistoryPage} from '../transaction-history/transaction-history';
import {StorageUtil} from "../../utils/storage.util";
import {MatSnackBar, MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {Platform} from 'ionic-angular';
import {AddTokenPage} from "../add-token/add-token";
import {SendEthPage} from "../send-eth/send-eth";
// import solc from 'solc/index.js';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {

  private walletData: Wallet = new Wallet();
  protected walletBalance: string;
  protected walletBalanceStatus: string = 'pending';

  protected tokenValid: boolean = false;

  constructor(public navParams: NavParams,
              private storageUtil: StorageUtil,
              private event: Events,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              public navCtrl: NavController,
              private platform: Platform
  ) {

    let walletDataId = navParams.get('data')['id'];

    this.storageUtil.getWallet(walletDataId).then((wallet: Wallet) => {
      this.walletData = wallet;

      this.getBalance();
    }).catch((e) => {
      this.snackBar.open('there is an error loading your wallet', 'Dismiss', {
        duration: 2000,
      });
    });

  }


  protected onSubmit(event: Event) {
    event.preventDefault();
  }

  protected getBalance() {
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


  // protected createToken() {
    // let myContract = new web3.eth.Contract(
    //   [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}],
    //   this._model.address,
    //   {
    //     from: this.walletData.address, // default from address
    //     gas: '4700000'
    //   }
    // );
    //
    // solc().compile('', 1, this.findImports);
  // }

  // private findImports(path) {
  //
  // }

  protected readyRemoveToken(tokenId: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to remove this token?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.removeToken(tokenId);
        }
      }
      deregister();

    });
  }

  private removeToken(tokenId: string) {
    this.storageUtil.removeTokenFromWallet(tokenId, this.walletData.id).then((token: Token) => {
      let index = this.walletData.tokens.indexOf(token);
      this.walletData.tokens.splice(index, 1);
    })
  }

  protected readyRemoveWallet() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to remove this wallet?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.removeWallet()
        }
      }
      deregister();

    });
  }

  private removeWallet() {
    this.storageUtil.removeWallet(this.walletData.id).then((wallet: Wallet) => {
      this.event.publish('wallet.removed', wallet);
      this.navCtrl.goToRoot({});
    });
  }

  protected gotoSendETH() {
    this.navCtrl.push(SendEthPage, {
      ethInfo: {
        address: this.walletData.address,
        privateKey: this.walletData.privateKey
      }
    });
  }

  protected gotoSendToken(tokenInfo: any) {
    this.navCtrl.push(SendTokenPage, {
      tokenInfo: tokenInfo
    });
  }

  protected gotoReceiveToken(address: string) {
    this.navCtrl.push(ReceiveTokenPage, {
      address: address,
      walletName: this.walletData.name
    });
  }

  protected gotoTransactionHistory(transactionInfo: any) {
    this.navCtrl.push(TransactionHistoryPage, {
      transactionInfo: transactionInfo
    });
  }

  protected addTokenCallbackFunction = (success: boolean, token: Token) => {
    return new Promise((resolve, reject) => {
      if (success) {
        this.walletData.tokens.push(token);
      }
      resolve();
    });
  }

  protected gotoAddToken() {
    this.navCtrl.push(AddTokenPage, {
      walletId: this.walletData.id,
      walletAddress: this.walletData.address,
      callback: this.addTokenCallbackFunction
    });
  }

}
