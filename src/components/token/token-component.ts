import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import W3 from 'web3';
import * as globals from '../../utils/global.util';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'wa-token',
  templateUrl: 'token-component.html'
})
export class TokenComponent implements OnInit {

  @Input()
  private tokenId: string;
  @Input()
  private address: string;
  @Input()
  private privateKey: string;
  @Input()
  private contract: string;
  @Input()
  private symbol: string;
  @Input()
  private decimals: number;

  @Output()
  public onSendToken = new EventEmitter();

  @Output()
  public onReceiveToken = new EventEmitter();

  @Output()
  public onTransactionHistory = new EventEmitter();

  @Output()
  public onRemoveToken = new EventEmitter();


  protected tokenBalance: string;
  protected tokenBalanceStatus: string = 'pending';


  private myContract: any;

  constructor() {

  }

  public ngOnInit() {
    this.myContract = new web3.eth.Contract(
      [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeSub","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeDiv","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeMul","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"safeAdd","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}],
      this.contract,
      {
        from: this.address, // default from address
        gas: '4700000'
      }
    );

    this.getTokenBalance();

  }


  private getTokenBalance() {

    this.tokenBalanceStatus = 'pending';

    this.myContract.methods['balanceOf'](this.address).call({from: this.address})
      .then((receipt) => {
        this.tokenBalance = receipt / Math.pow(10, this.decimals) + " " + this.symbol;
        this.tokenBalanceStatus = 'active'
      })
      .catch(function(e) {
        console.log(e);
      })


  }

  protected gotoSendToken() {
    this.onSendToken.emit({
      address: this.address,
      privateKey: this.privateKey,
      contract: this.contract,
      symbol: this.symbol,
      decimals: this.decimals
    });
  }

  protected gotoReceiveToken() {
    this.onReceiveToken.emit(this.address);
  }

  protected gotoHistory() {
    this.onTransactionHistory.emit({
      address: this.address,
      contract: this.contract,
      symbol: this.symbol
    });
  }

  protected removeToken() {
    this.onRemoveToken.emit(this.tokenId);
  }

  protected onSubmit(event: Event) {
    event.preventDefault();
  }


}
