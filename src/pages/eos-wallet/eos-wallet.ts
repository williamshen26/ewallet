import {Component} from "@angular/core";
import {EosWallet} from "../../models/wallet-model";
import {NavParams, Events, NavController} from "ionic-angular";
import {StorageUtil} from "../../utils/storage.util";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Platform} from 'ionic-angular';
import * as globals from '../../utils/global.util';
import {ReceiveTokenPage} from "../receive-token/receive-token";
import {SendEosPage} from "../send-eos/send-eos";

import Eos from 'eosjs/lib/index.js';
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {EosContractFormPage} from "../eos-contract-form/eos-contract-form";
import {EosAddTokenPage} from "../eos-add-token/eos-add-token";
import {EosToken} from "../../models/token-model";
import {EosStackResourcesPage} from "../eos-stack-resources/eos-stack-resources";
import {EosBuySellRamPage} from "../eos-buysell-ram/eos-buysell-ram";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-wallet',
  templateUrl: 'eos-wallet.html'
})
export class EosWalletPage {
  private walletData: EosWallet = new EosWallet();
  private walletDataId: string;
  protected walletBalance: string;
  protected walletBalanceStatus: string = 'pending';

  protected tokenValid: boolean = false;

  protected cpuUsed: number;
  protected cpuMax: number;

  protected bwUsed: number;
  protected bwMax: number;

  protected ramUsed: number;
  protected ramMax: number;

  constructor(public navParams: NavParams,
              private storageUtil: StorageUtil,
              private event: Events,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              public navCtrl: NavController,
              private platform: Platform
  ) {

    this.walletDataId = navParams.get('data')['id'];

  }

  private loadWallet(walletDataId: string) {
    this.storageUtil.getEosWallet(walletDataId).then((wallet: EosWallet) => {
      this.walletData = wallet;
      config.keyProvider = [this.walletData.privateKey];

      this.getBalance();
      this.getSystemData();
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('there is an error loading your wallet', 'Dismiss', {
        duration: 2000,
      });
    });
  }

  protected getSystemData() {
    eos.getAccount(this.walletData.account).then((account) => {
      this.cpuUsed = account['cpu_limit']['used'];
      this.cpuMax = account['cpu_limit']['max'];
      this.bwUsed = account['net_limit']['used'];
      this.bwMax = account['net_limit']['max'];
      this.ramUsed = account['ram_usage'];
      this.ramMax = account['ram_quota'];
    });
  }

  protected getBalance() {
    this.walletBalanceStatus = 'pending';

    eos.getCurrencyBalance('eosio.token', this.walletData.account, 'EOS').then((balance) => {
      this.walletBalance = balance;
      this.walletBalanceStatus = 'active';
    }).catch(function(e) {
      console.log(e);
    });

  }

  protected gotoReceiveToken(account: string) {
    this.navCtrl.push(ReceiveTokenPage, {
      address: account,
      walletName: account
    });
  }

  protected gotoSendEos() {
    this.navCtrl.push(SendEosPage, {
      eosInfo: {
        account: this.walletData.account,
        privateKey: this.walletData.privateKey
      }
    });
  }

  protected readyRemoveWallet() {
    let dialogRef = this.dialog['open'](ConfirmDialogComponent, {
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
    this.storageUtil.removeEosWallet(this.walletData.id).then((wallet: EosWallet) => {
      this.event.publish('wallet.removed', wallet);
      this.navCtrl.goToRoot({});
    });
  }

  protected gotoCreateContract() {
    this.navCtrl.push(EosContractFormPage, {
      eosInfo: {
        walletId: this.walletData.id,
        account: this.walletData.account,
        privateKey: this.walletData.privateKey
      }
    })
  }

  protected gotoAddToken() {
    this.navCtrl.push(EosAddTokenPage, {
      walletId: this.walletData.id
    });
  }


  protected gotoStackResource() {
    this.navCtrl.push(EosStackResourcesPage, {
      stack: true,
      walletAccount: this.walletData.account,
      walletPrivateKey: this.walletData.privateKey
    });
  }

  protected gotoUnstackResource() {
    this.navCtrl.push(EosStackResourcesPage, {
      stack: false,
      walletAccount: this.walletData.account,
      walletPrivateKey: this.walletData.privateKey
    });
  }

  protected gotoBuyRAM() {
    this.navCtrl.push(EosBuySellRamPage, {
      buy: true,
      walletAccount: this.walletData.account,
      walletPrivateKey: this.walletData.privateKey
    });
  }

  protected gotoSellRAM() {
    this.navCtrl.push(EosBuySellRamPage, {
      buy: false,
      walletAccount: this.walletData.account,
      walletPrivateKey: this.walletData.privateKey
    });
  }

  protected readyRemoveToken(tokenId: string) {
    let dialogRef = this.dialog['open'](ConfirmDialogComponent, {
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
    this.storageUtil.removeEosTokenFromWallet(tokenId, this.walletData.id).then((token: EosToken) => {
      for (let index = 0; index < this.walletData.tokens.length; index++) {
        if (this.walletData.tokens[index].id === token.id) {
          this.walletData.tokens.splice(index, 1);
          break;
        }
      }
    })
  }

  protected ionViewWillEnter() {
    this.loadWallet(this.walletDataId);
  }
}
