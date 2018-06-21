import {Component, OnInit} from '@angular/core';
import W3 from 'web3';
import * as globals from '../../utils/global.util';
import {NavParams} from 'ionic-angular';
import {TokenTransaction} from "../../models/token-transaction-model";

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html'
})
export class TransactionHistoryPage implements OnInit {
  private transactionInfo: any;
  private address: string;
  private contract: string;
  protected symbol: string;

  private sendLog: Array<TokenTransaction> = [];
  private receiveLog: Array<TokenTransaction> = [];

  constructor(private navParams: NavParams) {
    this.transactionInfo = this.navParams.get('transactionInfo');

    this.address = this.transactionInfo['address'];
    this.contract = this.transactionInfo['contract'];
    this.symbol = this.transactionInfo['symbol'];

  }

  public ngOnInit() {

    let sendOption: any = {
      fromBlock: '0x0',
      toBlock: 'latest',
      address: this.contract,
      topics: [web3.utils.soliditySha3("Transfer(address,address,uint256)"), web3.utils.padLeft(this.address, 64, '0'), null]
    };

    let receiveOption: any = {
      fromBlock: '0x0',
      toBlock: 'latest',
      address: this.contract,
      topics: [web3.utils.soliditySha3("Transfer(address,address,uint256)"), null, web3.utils.padLeft(this.address, 64, '0')]
    };

    web3.eth.getPastLogs(sendOption).then(logArray => {
      for (let log of logArray){
        let tokenTransaction: TokenTransaction = new TokenTransaction();
        tokenTransaction.from = this.address;
        tokenTransaction.to = '0x' + log.topics[2].slice(26, 66);
        tokenTransaction.amount = +web3.utils.fromWei(log.data, 'ether');
        tokenTransaction.hash = log.transactionHash;
        this.sendLog.push(tokenTransaction);
      }
      this.sendLog.reverse();
    });

    web3.eth.getPastLogs(receiveOption).then(logArray => {
      for (let log of logArray){
        let tokenTransaction: TokenTransaction = new TokenTransaction();
        tokenTransaction.from = '0x' + log.topics[1].slice(26, 66);
        tokenTransaction.to = this.address;
        tokenTransaction.amount = +web3.utils.fromWei(log.data, 'ether');
        tokenTransaction.hash = log.transactionHash;
        this.receiveLog.push(tokenTransaction);
      }
      this.receiveLog.reverse();
    });

  }
}
