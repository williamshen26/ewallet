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
      for (let index = 0; index < this.walletData.tokens.length; index++) {
        if (this.walletData.tokens[index].id === token.id) {
          this.walletData.tokens.splice(index, 1);
          break;
        }
      }
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
