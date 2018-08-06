import {OnInit, Component, Input} from "@angular/core";
import * as globals from '../../utils/global.util';
import Eos from 'eosjs/lib/index.js';
import {NavController} from "ionic-angular";
import {ReceiveTokenPage} from "../../pages/receive-token/receive-token";
import {SendEosPage} from "../../pages/send-eos/send-eos";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'wa-eos-token',
  templateUrl: 'eos-token.component.html'
})
export class EosTokenComponent implements OnInit {
  @Input()
  private tokenId: string;
  @Input()
  private account: string;
  @Input()
  private symbol: string;

  @Input()
  private walletAccount: string;
  @Input()
  private walletPrivateKey: string;

  protected tokenBalance: string;
  protected tokenBalanceStatus: string = 'pending';

  constructor(public navCtrl: NavController) {

  }

  public ngOnInit() {


  }

  protected onOpen() {
    this.getTokenBalance();
  }

  private getTokenBalance() {
    this.tokenBalanceStatus = 'pending';
    eos.getCurrencyBalance(this.account, this.walletAccount, this.symbol.toUpperCase()).then((balance) => {
      if (balance != '') {
        this.tokenBalance = balance;
      } else {
        this.tokenBalance = '0.000 ' + this.symbol.toUpperCase()
      }
      this.tokenBalanceStatus = 'active';
    });
  }

  protected gotoSendToken() {
    this.navCtrl.push(SendEosPage, {
      eosInfo: {
        account: this.walletAccount,
        privateKey: this.walletPrivateKey,
        code: this.account,
        symbol: this.symbol
      }
    });
  }

  protected gotoReceiveToken() {
    this.navCtrl.push(ReceiveTokenPage, {
      address: this.walletAccount,
      walletName: this.walletAccount
    });
  }
}
